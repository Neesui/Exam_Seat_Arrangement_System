import sys
import json
from collections import defaultdict
import random

# Read input JSON from stdin
input_data = sys.stdin.read()
data = json.loads(input_data)

students = data.get("students", [])
room_assignments = data.get("roomAssignments", [])

# Group students by college
college_students = defaultdict(list)
for student in students:
    college_students[student["college"]].append(student)

# Shuffle to randomize within colleges
for col_students in college_students.values():
    random.shuffle(col_students)

# Create a list of all students interleaved from different colleges to spread them out
interleaved_students = []
while any(college_students.values()):
    for college in list(college_students.keys()):
        if college_students[college]:
            interleaved_students.append(college_students[college].pop(0))

# Now assign them to benches across rooms
seat_assignments = []
student_index = 0

for assignment in room_assignments:
    room = assignment["room"]
    benches = sorted(room["benches"], key=lambda b: (b["row"], b["column"]))

    for bench in benches:
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

# Return the final seat assignment
print(json.dumps(seat_assignments))
