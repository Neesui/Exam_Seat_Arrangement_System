import json
from datetime import datetime, timezone
from db_connection import get_db_connection

# ------------------ Helper Functions ------------------

def parse_time(dt):
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt

def has_conflict(existing_assignments, new_start, new_end):
    new_start = parse_time(new_start)
    new_end = parse_time(new_end)
    for e in existing_assignments:
        start = parse_time(e["start"])
        end = parse_time(e["end"])
        if start and end and max(start, new_start) < min(end, new_end):
            return True
    return False

# ------------------ Fetch Data ------------------

def fetch_room_assignments(conn):
    with conn.cursor() as cur:
        cur.execute("""
            SELECT ra.id AS room_assignment_id, e."startTime", e."endTime"
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
        invigilators = [{"id": r[0], "assignments": []} for r in cur.fetchall()]

        # Existing assignments
        for inv in invigilators:
            cur.execute("""
                SELECT e."startTime", e."endTime"
                FROM "invigilatorOnAssignment" ioa
                JOIN "invigilatorAssignment" ia ON ioa."invigilatorAssignmentId" = ia.id
                JOIN "roomAssignment" ra ON ia."roomAssignmentId" = ra.id
                JOIN "exam" e ON ra."examId" = e.id
                WHERE ioa."invigilatorId" = %s AND ia.status = 'ASSIGNED';
            """, (inv["id"],))
            inv["assignments"] = [{"start": row[0], "end": row[1]} for row in cur.fetchall()]
        return invigilators

# ------------------ Assignment Algorithm ------------------

def auto_assign(room_assignments, invigilators, min_per_room=2, max_per_invigilator=2):
    if len(invigilators) < min_per_room:
        return {"error": f"Not enough invigilators. At least {min_per_room} required."}

    assignments_by_room = {}
    inv_count = len(invigilators)
    current_index = 0

    for room in room_assignments:
        assigned_count = 0
        attempts = 0
        max_attempts = inv_count * 2

        while assigned_count < min_per_room and attempts < max_attempts:
            inv = invigilators[current_index % inv_count]
            current_index += 1
            attempts += 1

            if len(inv["assignments"]) >= max_per_invigilator:
                continue

            if has_conflict(inv["assignments"], room["start"], room["end"]):
                continue

            inv["assignments"].append({"start": room["start"], "end": room["end"]})

            if room["id"] not in assignments_by_room:
                assignments_by_room[room["id"]] = []

            assignments_by_room[room["id"]].append({
                "invigilatorId": inv["id"],
                "status": "ASSIGNED",
                "assignedAt": datetime.now(timezone.utc).isoformat(),
                "completedAt": None
            })
            assigned_count += 1

        if assigned_count < min_per_room:
            return {"error": f"Cannot assign {min_per_room} invigilators to room {room['id']} due to conflicts."}

    output = []
    for room_id, inv_list in assignments_by_room.items():
        output.append({
            "roomAssignmentId": room_id,
            "invigilators": inv_list
        })

    return output

# ------------------ Main ------------------

def main():
    conn = None
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
