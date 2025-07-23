import json
from db_connection import get_db_connection
from collections import defaultdict


def fetch_exams(conn):
    with conn.cursor() as cur:
        cur.execute('SELECT id, "startTime", "endTime" FROM "exam" ORDER BY "startTime";')
        rows = cur.fetchall()
        return [{"id": r[0], "start": r[1], "end": r[2]} for r in rows]


def fetch_rooms(conn):
    with conn.cursor() as cur:
        cur.execute("""
            SELECT r.id, r."roomNumber", COALESCE(SUM(b.capacity), 0) AS "totalCapacity"
            FROM "room" r
            LEFT JOIN "bench" b ON r.id = b."roomId"
            GROUP BY r.id
            ORDER BY r.id;
        """)
        rows = cur.fetchall()
        return [{"id": r[0], "roomNumber": r[1], "capacity": r[2]} for r in rows]


def fetch_exam_student_counts(conn):
    with conn.cursor() as cur:
        cur.execute('''
            SELECT sp."examId", COUNT(s.id)
            FROM "seat" s
            JOIN "seatingPlan" sp ON s."seatingPlanId" = sp.id
            GROUP BY sp."examId";
        ''')
        return {r[0]: r[1] for r in cur.fetchall()}


def fetch_existing_assignments(conn):
    with conn.cursor() as cur:
        cur.execute("""
            SELECT ra."examId", ra."roomId", e."startTime", e."endTime"
            FROM "roomAssignment" ra
            JOIN "exam" e ON ra."examId" = e.id
            WHERE ra."isActive" = TRUE;
        """)
        rows = cur.fetchall()
        return [
            {"examId": r[0], "roomId": r[1], "start": r[2], "end": r[3]}
            for r in rows
        ]


def is_conflict(start1, end1, start2, end2):
    return max(start1, start2) < min(end1, end2)


def assign_rooms(exams, rooms, exam_students, existing_assignments):
    # Step 1: Prepare schedule map per room
    room_schedule = defaultdict(list)
    for ea in existing_assignments:
        room_schedule[ea['roomId']].append((ea['start'], ea['end']))

    # Step 2: Sort exams by student count (descending) to use load-balancing efficiently
    exams.sort(key=lambda x: exam_students.get(x['id'], 0), reverse=True)

    assignments = []

    for exam in exams:
        exam_id = exam['id']
        start, end = exam['start'], exam['end']
        students = exam_students.get(exam_id, 0)

        # Sort rooms by current load (ascending)
        rooms_sorted = sorted(rooms, key=lambda r: sum(cap for s, e in room_schedule[r['id']] if is_conflict(start, end, s, e)))

        for room in rooms_sorted:
            capacity = room['capacity']
            if capacity < students:
                continue

            conflict = False
            for s, e in room_schedule[room['id']]:
                if is_conflict(start, end, s, e):
                    conflict = True
                    break

            if not conflict:
                room_schedule[room['id']].append((start, end))
                assignments.append({"examId": exam_id, "roomId": room['id']})
                break

    return assignments


def main():
    try:
        conn = get_db_connection()
        exams = fetch_exams(conn)
        rooms = fetch_rooms(conn)
        exam_students = fetch_exam_student_counts(conn)
        existing_assignments = fetch_existing_assignments(conn)

        result = assign_rooms(exams, rooms, exam_students, existing_assignments)
        print(json.dumps(result, default=str))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
    finally:
        conn.close()


if __name__ == "__main__":
    main()
