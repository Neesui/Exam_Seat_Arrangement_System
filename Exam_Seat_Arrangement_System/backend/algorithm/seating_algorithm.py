import sys
import json
import random
from collections import defaultdict
from copy import deepcopy

# ---- CONFIG ----
POPULATION_SIZE = 50
GENERATIONS = 100
MUTATION_RATE = 0.1

# ---- UTILITIES ----
def get_total_capacity(room):
    return sum(bench['capacity'] for bench in room['benches'])

def flatten_benches(rooms):
    benches = []
    for room in rooms:
        for bench in room['benches']:
            benches.append({
                'benchId': bench['id'],
                'benchName': bench.get('name', f"Bench {bench['id']}"),  # fallback name
                'capacity': bench['capacity'],
                'roomId': room['roomId'],
                'roomNumber': room.get('roomNumber', f"Room {room['roomId']}"),
                'bench': bench
            })
    return benches

# ---- CHROMOSOME OPS ----
def create_individual(students, benches):
    student_pool = deepcopy(students)
    random.shuffle(student_pool)
    individual = []
    index = 0

    for bench in benches:
        for pos in range(1, bench['capacity'] + 1):
            if index >= len(student_pool):
                break
            individual.append({
                'studentId': student_pool[index]['id'],
                'benchId': bench['benchId'],
                'roomId': bench['roomId'],
                'position': pos
            })
            index += 1

    return individual

def fitness(individual, student_colleges):
    score = 0
    bench_groups = defaultdict(list)

    for seat in individual:
        key = (seat['benchId'])
        bench_groups[key].append(student_colleges[seat['studentId']])

    for students in bench_groups.values():
        unique_colleges = len(set(students))
        score += unique_colleges * 10 - (len(students) - unique_colleges) * 5

    score += len(individual)  
    return score

def crossover(parent1, parent2):
    split = len(parent1) // 2
    child = parent1[:split] + parent2[split:]
    seen = set()
    result = []
    for gene in child:
        if gene['studentId'] not in seen:
            result.append(gene)
            seen.add(gene['studentId'])
    return result

def mutate(individual, benches, student_pool):
    if random.random() > MUTATION_RATE:
        return individual

    mutant = deepcopy(individual)
    i = random.randint(0, len(mutant) - 1)
    available_students = list(set(s['id'] for s in student_pool) - set(g['studentId'] for g in mutant))
    if not available_students:
        return mutant

    replacement = random.choice(available_students)
    mutant[i]['studentId'] = replacement
    return mutant

# ---- GROUP AND PRINT FUNCTIONS ----
def group_seating_plan(seating_list, student_colleges, benches):
    """
    Group seating by roomId -> benchId -> list of (college, studentId)
    """
    # Create lookup for bench info by benchId
    bench_info = {b['benchId']: b for b in benches}

    room_plan = defaultdict(lambda: defaultdict(list))

    for seat in seating_list:
        roomId = seat['roomId']
        benchId = seat['benchId']
        studentId = seat['studentId']
        college = student_colleges.get(studentId, "Unknown")
        room_plan[roomId][benchId].append((college, studentId))

    return room_plan, bench_info

def print_room_plan(room_plan, bench_info):
    for roomId, benches in room_plan.items():
        # Compute total seats assigned in this room
        total_seats = sum(len(students) for students in benches.values())
        roomNumber = None
        # Attempt to get room number from bench_info (all benches share same roomNumber)
        for benchId in benches.keys():
            roomNumber = bench_info[benchId].get('roomNumber', f"Room {roomId}")
            break

        print(f"{roomNumber} (Capacity: {total_seats} seats)")
        # Sort benches by benchId or name if needed
        for benchId, students in sorted(benches.items()):
            benchName = bench_info[benchId].get('benchName', f"Bench {benchId}")
            seats_str = ", ".join([f"{college} - {studentId}" for college, studentId in students])
            print(f"  {benchName}: {seats_str}")
        print()

# ---- MAIN ----
def main():
    input_data = sys.stdin.read()
    data = json.loads(input_data)

    students = data['students']
    room_assignments = data['roomAssignments']
    student_colleges = {s['id']: s['college'] for s in students}

    all_rooms = [
        {
            'roomId': r['room']['id'],
            'roomNumber': r['room'].get('roomNumber', f"Room {r['room']['id']}"),
            'benches': sorted(r['room']['benches'], key=lambda b: (b['row'], b['column']))
        }
        for r in room_assignments
    ]

    benches = flatten_benches(all_rooms)

    # --- GA START ---
    population = [create_individual(students, benches) for _ in range(POPULATION_SIZE)]

    for _ in range(GENERATIONS):
        population.sort(key=lambda ind: fitness(ind, student_colleges), reverse=True)
        next_gen = population[:5]  # elitism

        while len(next_gen) < POPULATION_SIZE:
            p1, p2 = random.choices(population[:25], k=2)
            child = crossover(p1, p2)
            child = mutate(child, benches, students)
            next_gen.append(child)

        population = next_gen

    # Best solution
    best = max(population, key=lambda ind: fitness(ind, student_colleges))

    # Group and print the best seating plan by room and bench for debugging
    room_plan, bench_info = group_seating_plan(best, student_colleges, benches)
    print_room_plan(room_plan, bench_info)

    # Output the raw best seating list JSON for your Node.js backend
    print(json.dumps(best))

if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
