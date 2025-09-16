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
def flatten_benches(rooms):
    benches = []
    for room in rooms:
        for bench in room['benches']:
            benches.append({
                'benchId': bench['id'],
                'capacity': bench['capacity'],
                'roomId': room['roomId'],
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
        key = seat['benchId']
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

    best = max(population, key=lambda ind: fitness(ind, student_colleges))

    # ✅ Output JSON only
    sys.stdout.write(json.dumps(best))

if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        sys.stdout.write(json.dumps({"error": str(e)}))
        sys.exit(1)
