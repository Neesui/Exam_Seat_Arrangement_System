import sys
import json
import random
from collections import defaultdict

try:
    # Read JSON input
    input_data = sys.stdin.read()
    data = json.loads(input_data)

    students = data.get("students", [])
    room_assignments = data.get("roomAssignments", [])

    if not students or not room_assignments:
        raise ValueError("Missing students or room assignments.")

    # Group students by college
    college_students = defaultdict(list)
    for student in students:
        college_students[student["college"]].append(student)

    # Shuffle within colleges
    for col_students in college_students.values():
        random.shuffle(col_students)

    # Interleave across colleges
    interleaved_students = []
    while any(college_students.values()):
        for college in list(college_students.keys()):
            if college_students[college]:
                interleaved_students.append(college_students[college].pop(0))

    # Prepare rooms sorted by capacity
    all_rooms = []
    for assignment in room_assignments:
        room = assignment["room"]
        benches = sorted(room["benches"], key=lambda b: (b["row"], b["column"]))
        room_capacity = sum(bench["capacity"] for bench in benches)
        all_rooms.append({
            "roomId": room["id"],
            "roomNumber": room["roomNumber"],
            "benches": benches,
            "capacity": room_capacity
        })

    all_rooms.sort(key=lambda x: x["capacity"], reverse=True)

    seat_assignments = []
    student_index = 0

    for room in all_rooms:
        for bench in room["benches"]:
            for pos in range(1, bench["capacity"] + 1):
                if student_index >= len(interleaved_students):
                    break
                student = interleaved_students[student_index]
                seat_assignments.append({
                    "studentId": student["id"],
                    "benchId": bench["id"],
                    "position": pos
                })
                student_index += 1
            if student_index >= len(interleaved_students):
                break
        if student_index >= len(interleaved_students):
            break

    # Output valid JSON
    print(json.dumps(seat_assignments))

except Exception as e:
    print(json.dumps({ "error": str(e) }))
    sys.exit(1)
