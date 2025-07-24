import json
from datetime import datetime, timezone
from db_connection import get_db_connection

def parse_time(dt):
    return dt.replace(tzinfo=timezone.utc)

def has_conflict(existing, new_start, new_end):
    new_start = parse_time(new_start)
    new_end = parse_time(new_end)

    for e in existing:
        start = parse_time(e['start'])
        end = parse_time(e['end'])
        if max(start, new_start) < min(end, new_end):
            return True
    return False

def fetch_room_assignments(conn):
    with conn.cursor() as cur:
        cur.execute("""
            SELECT ra.id, e."startTime", e."endTime"
            FROM "roomAssignment" ra
            JOIN "exam" e ON ra."examId" = e.id
            WHERE ra.status = 'ACTIVE'
            ORDER BY e."startTime";
        """)
        rows = cur.fetchall()
        return [{"id": r[0], "start": r[1], "end": r[2]} for r in rows]

def fetch_invigilators(conn):
    with conn.cursor() as cur:
        cur.execute('SELECT id FROM "invigilator" ORDER BY id;')
        invigilators = [{"id": row[0], "assignments": []} for row in cur.fetchall()]

        for inv in invigilators:
            cur.execute("""
                SELECT e."startTime", e."endTime"
                FROM "invigilatorAssignment" ia
                JOIN "roomAssignment" ra ON ia."roomAssignmentId" = ra.id
                JOIN "exam" e ON ra."examId" = e.id
                WHERE ia."invigilatorId" = %s AND ia.status = 'ASSIGNED'
            """, (inv["id"],))
            inv["assignments"] = [{"start": row[0], "end": row[1]} for row in cur.fetchall()]
        return invigilators

def auto_assign(room_assignments, invigilators, max_per_invigilator=2):
    assignments = []
    invigilator_count = len(invigilators)
    current_index = 0

    for room in room_assignments:
        assigned_count = 0
        attempts = 0
        max_attempts = invigilator_count * 2

        while assigned_count < 2 and attempts < max_attempts:
            inv = invigilators[current_index % invigilator_count]
            current_index += 1
            attempts += 1

            if len(inv["assignments"]) >= max_per_invigilator:
                continue

            if not has_conflict(inv["assignments"], room["start"], room["end"]):
                inv["assignments"].append({"start": room["start"], "end": room["end"]})
                assignments.append({
                    "invigilatorId": inv["id"],
                    "roomAssignmentId": room["id"],
                    "status": "ASSIGNED",
                    "assignedAt": datetime.now(timezone.utc).isoformat(),
                    "completedAt": None
                })
                assigned_count += 1

    return assignments

def main():
    try:
        conn = get_db_connection()
        room_assignments = fetch_room_assignments(conn)
        invigilators = fetch_invigilators(conn)

        result = auto_assign(room_assignments, invigilators)
        print(json.dumps(result, indent=2, default=str))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    main()
