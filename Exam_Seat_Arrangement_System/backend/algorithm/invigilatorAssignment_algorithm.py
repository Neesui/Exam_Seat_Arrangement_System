import json
from datetime import datetime, timezone
from db_connection import get_db_connection


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

        # Fetch existing assignments
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


def auto_assign(room_assignments, invigilators, min_per_room=2, max_per_invigilator=2):
    """
    Automatically assigns invigilators to room assignments ensuring:
    - No time conflicts
    - Balanced rotation across all invigilators
    - Every invigilator gets equal opportunity
    """
    if len(invigilators) < min_per_room:
        return {"error": f"Not enough invigilators. At least {min_per_room} required."}

    assignments_by_room = {}
    inv_count = len(invigilators)
    used_invigilators = set()  # Track recently used invigilators for fairness

    for room in room_assignments:
        assigned_count = 0
        max_attempts = inv_count * 2

        # Sort invigilators by how many times they’ve been assigned so far (fairness)
        invigilators.sort(key=lambda i: len(i["assignments"]))

        for inv in invigilators:
            if assigned_count >= min_per_room:
                break

            # Skip if invigilator already reached max limit
            if len(inv["assignments"]) >= max_per_invigilator:
                continue

            # Skip if invigilator has schedule conflict
            if has_conflict(inv["assignments"], room["start"], room["end"]):
                continue

            # Skip recently used invigilators if others are available
            if inv["id"] in used_invigilators and len(used_invigilators) < inv_count:
                continue

            # Assign invigilator to this exam
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
            used_invigilators.add(inv["id"])

        # Once everyone used once, reset rotation
        if len(used_invigilators) == inv_count:
            used_invigilators.clear()

        # Ensure minimum invigilators assigned
        if assigned_count < min_per_room:
            return {"error": f"Cannot assign {min_per_room} invigilators to room {room['id']} due to conflicts or lack of available invigilators."}

    # Prepare final structured output
    output = []
    for room_id, inv_list in assignments_by_room.items():
        output.append({
            "roomAssignmentId": room_id,
            "invigilators": inv_list
        })

    return output


# main execution
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
