import sys
import json
import random
from collections import defaultdict

# -------- CONFIG --------
POPULATION_SIZE = 50
GENERATIONS = 100
MUTATION_RATE = 0.1

# -------- UTILITIES --------
def flatten_benches(rooms):
    benches = []
    for room in rooms:
        for bench in room['benches']:
            benches.append({
                'roomId': room['id'],
                'benchId': bench['id'],
                'capacity': bench['capacity']
            })
    return benches

def fitness(seating, students_by_college):
    conflicts = 0
    for bench in seating.values():
        colleges = [s['college'] for s in bench]
        if len(colleges) != len(set(colleges)):  # same college conflict
            conflicts += 1
    return -conflicts  # higher fitness is better

def generate_individual(students, benches):
    random.shuffle(students)
    seating = {}
    idx = 0
    for bench in benches:
        seating[bench['benchId']] = []
        for _ in range(bench['capacity']):
            if idx < len(students):
                seating[bench['benchId']].append(students[idx])
                idx += 1
    return seating

def crossover(parent1, parent2):
    child = {}
    for benchId in parent1:
        if random.random() < 0.5:
            child[benchId] = parent1[benchId]
        else:
            child[benchId] = parent2[benchId]
    return child

def mutate(individual, benches):
    if random.random() < MUTATION_RATE:
        b1, b2 = random.sample(list(individual.keys()), 2)
        if individual[b1] and individual[b2]:
            i1 = random.randrange(len(individual[b1]))
            i2 = random.randrange(len(individual[b2]))
            individual[b1][i1], individual[b2][i2] = individual[b2][i2], individual[b1][i1]
    return individual

def genetic_algorithm(students, rooms):
    benches = flatten_benches(rooms)
    students_by_college = defaultdict(list)
    for s in students:
        students_by_college[s['college']].append(s)

    population = [generate_individual(students[:], benches) for _ in range(POPULATION_SIZE)]

    for _ in range(GENERATIONS):
        population.sort(key=lambda ind: fitness(ind, students_by_college), reverse=True)
        next_gen = population[:10]  # elitism
        while len(next_gen) < POPULATION_SIZE:
            p1, p2 = random.sample(population[:20], 2)
            child = crossover(p1, p2)
            next_gen.append(mutate(child, benches))
        population = next_gen

    best = max(population, key=lambda ind: fitness(ind, students_by_college))

    # Group seating by room
    room_output = defaultdict(list)
    for bench in benches:
        benchId = bench['benchId']
        roomId = bench['roomId']
        room_output[roomId].append({
            "benchId": benchId,
            "students": best.get(benchId, [])
        })

    return room_output

# -------- MAIN --------
if __name__ == "__main__":
    data = json.load(sys.stdin)  # input from backend
    students = data['students']
    rooms = data['rooms']

    seating_plan = genetic_algorithm(students, rooms)

    print(json.dumps(seating_plan, indent=2))
