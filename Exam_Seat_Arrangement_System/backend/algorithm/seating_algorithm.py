import sys
import json
from collections import defaultdict

def assign_seats_zigzag(data):
    students = data["students"]
    room_assignments = data["roomAssignments"]

    college_students = defaultdict(list)
    for s in students:
        college_students[s["college"]].append(s)

    colleges = list(college_students.keys())
    college_indices = {college: 0 for college in colleges}
    total_students = len(students)
    assigned_students = []

    while len(assigned_students) < total_students:
        for college in colleges:
            idx = college_indices[college]
            if idx < len(college_students[college]):
                assigned_students.append(college_students[college][idx])
                college_indices[college] += 1
            if len(assigned_students) == total_students:
                break

    benches = []
    for ra in room_assignments:
        for bench in ra["room"]["benches"]:
            benches.append({
                "benchId": bench["id"],
                "row": bench["row"],
                "capacity": bench["capacity"]
            })

    benches.sort(key=lambda b: b["row"])
    benches_by_row = defaultdict(list)
    for bench in benches:
        benches_by_row[bench["row"]].append(bench)

    for row in benches_by_row:
        benches_by_row[row].sort(key=lambda b: b["benchId"])

    sorted_rows = sorted(benches_by_row.keys())
    output = []
    student_idx = 0

    for i, row in enumerate(sorted_rows):
        benches_in_row = benches_by_row[row]
        if (i + 1) % 2 == 0:
            benches_in_row = list(reversed(benches_in_row))

        for bench in benches_in_row:
            bench_colleges = set()
            seats_filled = 0

            while seats_filled < bench["capacity"] and student_idx < total_students:
                student = assigned_students[student_idx]

                if student["college"] not in bench_colleges:
                    seats_filled += 1
                    bench_colleges.add(student["college"])
                    output.append({
                        "studentId": student["id"],
                        "benchId": bench["benchId"],
                        "position": seats_filled
                    })
                    student_idx += 1
                else:
                    found = False
                    for lookahead in range(student_idx + 1, total_students):
                        next_student = assigned_students[lookahead]
                        if next_student["college"] not in bench_colleges:
                            assigned_students[student_idx], assigned_students[lookahead] = \
                                assigned_students[lookahead], assigned_students[student_idx]
                            found = True
                            break
                    if not found:
                        break

    return output

if __name__ == "__main__":
    input_data = json.load(sys.stdin)
    seating = assign_seats_zigzag(input_data)
    print(json.dumps(seating))
