import json
from datetime import datetime
from db_connection import get_db_connection

def fetch_exams(conn):
    with conn.cursor() as cur:
        # Assuming exams table has startTime and endTime columns (timestamp)
        cur.execute("SELECT id, startTime, endTime FROM exam ORDER BY startTime;")
        rows = cur.fetchall()
        # Convert timestamps to datetime objects
        return [
            {"id": r[0], "start": r[1], "end": r[2]}
            for r in rows
        ]

def fetch_rooms(conn):
    with conn.cursor() as cur:
        # Assuming room table has capacity column (integer)
        cur.execute("SELECT id, capacity FROM room ORDER BY id;")
        rows = cur.fetchall()
        return [
            {"id": r[0], "capacity": r[1]}
            for r in rows
        ]

def fetch_exam_student_counts(conn):
    with conn.cursor() as cur:
        # Assuming a student table with examId foreign key
        cur.execute("""
            SELECT examId, COUNT(*) FROM student GROUP BY examId;
        """)
        rows = cur.fetchall()
        return {r[0]: r[1] for r in rows}

def is_time_conflict(start1, end1, start2, end2):
    # Return True if time intervals overlap
    return max(start1, start2) < min(end1, end2)

def schedule_exams_to_rooms(exams, rooms, exam_students_counts):
    room_schedules = {room['id']: [] for room in rooms}  # roomId -> list of assigned exams with time
    assignments = []

    for exam in exams:
        students_needed = exam_students_counts.get(exam['id'], 0)
        assigned = False

        for room in rooms:
            # Check if room capacity is enough
            if room['capacity'] < students_needed:
                continue

            # Check for time conflicts in this room
            conflicts = False
            for assigned_exam in room_schedules[room['id']]:
                if is_time_conflict(exam['start'], exam['end'], assigned_exam['start'], assigned_exam['end']):
                    conflicts = True
                    break

            if not conflicts:
                # Assign room to exam
                room_schedules[room['id']].append(exam)
                assignments.append({"examId": exam['id'], "roomId": room['id']})
                assigned = True
                break  # assigned exam, break room loop

        if not assigned:
            # Could implement splitting exams across multiple rooms here
            # For now just report failure to assign
            print(f"Could not assign room for exam {exam['id']} due to capacity/time conflicts")

    return assignments

def main():
    conn = get_db_connection()
    try:
        exams = fetch_exams(conn)
        rooms = fetch_rooms(conn)
        exam_students_counts = fetch_exam_student_counts(conn)

        assignments = schedule_exams_to_rooms(exams, rooms, exam_students_counts)

        # Output JSON for Node.js
        print(json.dumps(assignments))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
    finally:
        conn.close()

if __name__ == "__main__":
    main()
