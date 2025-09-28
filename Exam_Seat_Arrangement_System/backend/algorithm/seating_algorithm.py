import sys
import json
import random
from collections import defaultdict

#  config 
POPULATION_SIZE = 50
GENERATIONS = 200
MUTATION_RATE = 0.1

#   utilities 
def flatten_benches(rooms):
    benches = []
    for room in rooms:
        for bench in sorted(room["benches"], key=lambda b: b["id"]):
            benches.append({
                "roomId": room["id"],
                "benchId": bench["id"],
                "capacity": bench["capacity"]
            })
    return benches

def zigzag_order(benches):
    """Reorder benches in zigzag pattern (left-right alternating)."""
    zigzag = []
    left = True
    for i in range(0, len(benches), 2):
        if left:
            zigzag.extend(benches[i:i+2])
        else:
            zigzag.extend(reversed(benches[i:i+2]))
        left = not left
    return zigzag

def fitness(seating, students_by_college):
    """Fitness: fewer conflicts = better, also reward full usage of students."""
    conflicts = 0
    total_students = 0

    for bench in seating.values():
        colleges = [s["college"] for s in bench]
        total_students += len(colleges)
        if len(colleges) != len(set(colleges)):  # same-college conflict
            conflicts += 1

    return -(conflicts * 10) + total_students  

def generate_individual(students, benches):
    random.shuffle(students)
    seating = {bench["benchId"]: [] for bench in benches}
    idx = 0
    for bench in benches:
        for pos in range(1, bench["capacity"] + 1):  # assign positions
            if idx < len(students):
                student = students[idx].copy()
                student["position"] = pos   # 1=left, 2=right
                seating[bench["benchId"]].append(student)
                idx += 1
    return seating

def crossover(parent1, parent2):
    child = {}
    for benchId in parent1:
        if random.random() < 0.5:
            child[benchId] = parent1[benchId][:]
        else:
            child[benchId] = parent2[benchId][:]
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
    benches = zigzag_order(benches)

    students_by_college = defaultdict(list)
    for s in students:
        students_by_college[s["college"]].append(s)

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
        benchId = bench["benchId"]
        roomId = bench["roomId"]
        room_output[roomId].append({
            "benchId": benchId,
            "students": sorted(best.get(benchId, []), key=lambda s: s["position"])
        })

    return room_output

# main
if __name__ == "__main__":
    data = json.load(sys.stdin)
    students = data["students"]
    rooms = data["rooms"]

    seating_plan = genetic_algorithm(students, rooms)

    print(json.dumps(seating_plan, indent=2))
