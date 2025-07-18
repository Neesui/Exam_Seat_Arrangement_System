import json
from db_connection import get_db_connection


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
    if start1 is None or end1 is None or start2 is None or end2 is None:
        return False
    return max(start1, start2) < min(end1, end2)


def assign_rooms(exams, rooms, exam_students, existing_assignments):
    # Initialize schedules with existing assignments
    room_schedules = {room['id']: [] for room in rooms}
    for assign in existing_assignments:
        room_schedules[assign['roomId']].append({
            "start": assign["start"],
            "end": assign["end"]
        })

    assignments = []

    for exam in exams:
        students_needed = exam_students.get(exam['id'], 0)
        assigned = False

        for room in rooms:
            if room['capacity'] >= students_needed:
                conflict = any(
                    is_conflict(exam['start'], exam['end'], scheduled['start'], scheduled['end'])
                    for scheduled in room_schedules[room['id']]
                )

                if not conflict:
                    room_schedules[room['id']].append({
                        "start": exam["start"],
                        "end": exam["end"]
                    })
                    assignments.append({"examId": exam['id'], "roomId": room['id']})
                    assigned = True
                    break

        if not assigned:
            print(f"⚠️ No available room for exam {exam['id']} at {exam['start']}")

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
