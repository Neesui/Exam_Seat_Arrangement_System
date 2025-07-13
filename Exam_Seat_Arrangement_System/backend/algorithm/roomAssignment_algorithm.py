# backend/algorithm/roomAssignment_algorithm.py

import json
from db_connection import get_db_connection

def fetch_exams(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT id, startTime, endTime FROM exam ORDER BY startTime;")
        rows = cur.fetchall()
        return [{"id": r[0], "start": r[1], "end": r[2]} for r in rows]

def fetch_rooms(conn):
    with conn.cursor() as cur:
        cur.execute("""
            SELECT r.id, r.roomNumber, COALESCE(SUM(b.capacity), 0) AS totalCapacity
            FROM room r
            LEFT JOIN bench b ON r.id = b.roomId
            GROUP BY r.id
            ORDER BY r.id;
        """)
        rows = cur.fetchall()
        return [{"id": r[0], "roomNumber": r[1], "capacity": r[2]} for r in rows]

def fetch_exam_student_counts(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT examId, COUNT(*) FROM student GROUP BY examId;")
        return {r[0]: r[1] for r in cur.fetchall()}

def is_conflict(start1, end1, start2, end2):
    return max(start1, start2) < min(end1, end2)

def assign_rooms(exams, rooms, exam_students):
    room_schedules = {room['id']: [] for room in rooms}
    assignments = []

    for exam in exams:
        students_needed = exam_students.get(exam['id'], 0)
        for room in rooms:
            if room['capacity'] >= students_needed:
                conflict = False
                for assigned in room_schedules[room['id']]:
                    if is_conflict(exam['start'], exam['end'], assigned['start'], assigned['end']):
                        conflict = True
                        break
                if not conflict:
                    room_schedules[room['id']].append(exam)
                    assignments.append({"examId": exam['id'], "roomId": room['id']})
                    break
    return assignments

def main():
    try:
        conn = get_db_connection()
        exams = fetch_exams(conn)
        rooms = fetch_rooms(conn)
        exam_students = fetch_exam_student_counts(conn)
        result = assign_rooms(exams, rooms, exam_students)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
    finally:
        conn.close()

if __name__ == "__main__":
    main()
