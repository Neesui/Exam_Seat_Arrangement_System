import sys
import json
from datetime import datetime
from collections import defaultdict

def is_conflict(start1, end1, start2, end2):
    return max(start1, start2) < min(end1, end2)

def main():
    try:
        input_data = json.load(sys.stdin)
        exams = input_data.get("exams", [])
        rooms = input_data.get("rooms", [])

        room_schedule = defaultdict(list) 
        assignments = []  

        exams.sort(key=lambda e: len(e.get("students", [])), reverse=True)

        for exam in exams:
            exam_id = exam.get("id")
            start_str = exam.get("startTime")
            end_str = exam.get("endTime")
            students = exam.get("students", [])

            if not exam_id or not start_str or not end_str or not students:
                continue 

            try:
                start = datetime.fromisoformat(start_str)
                end = datetime.fromisoformat(end_str)
            except ValueError:
                continue  

            students_remaining = len(students)

            # Sort rooms by capacity descending
            sorted_rooms = sorted(
                rooms,
                key=lambda r: sum(b.get("capacity", 0) for b in r.get("benches", [])),
                reverse=True
            )

            for room in sorted_rooms:
                if students_remaining <= 0:
                    break

                room_id = room.get("id")
                if not room_id:
                    continue

                if any(is_conflict(start, end, s, e) for s, e in room_schedule[room_id]):
                    continue

                capacity = sum(b.get("capacity", 0) for b in room.get("benches", []))
                if capacity <= 0:
                    continue

                # Assign room
                room_schedule[room_id].append((start, end))
                assignments.append({
                    "examId": exam_id,
                    "roomId": room_id,
                    "assignedAt": datetime.now().isoformat(),
                    "completedAt": None
                })

                students_remaining -= capacity

        print(json.dumps(assignments))
    except Exception as e:
        print(json.dumps({ "error": str(e) }))
        sys.exit(1)

if __name__ == "__main__":
    main()
