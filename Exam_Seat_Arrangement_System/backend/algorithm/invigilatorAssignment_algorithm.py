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

        # Check if time ranges overlap
        if max(start, new_start) < min(end, new_end):
            return True
    return False


def fetch_room_assignments(conn):
    with conn.cursor() as cur:
        cur.execute("""
            SELECT ra.id, e."startTime", e."endTime"
            FROM "roomAssignment" ra
            JOIN "exam" e ON ra."examId" = e.id
            WHERE ra."isActive" = TRUE AND ra."isCompleted" = FALSE
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


def auto_assign_invigilators(room_assignments, invigilators, max_per_invigilator=2):
    assignments = []

    for room in room_assignments:
        start, end = room["start"], room["end"]
        assigned_count = 0

        for inv in invigilators:
            if len(inv["assignments"]) >= max_per_invigilator:
                continue
            if not has_conflict(inv["assignments"], start, end):
                inv["assignments"].append({"start": start, "end": end})
                assignments.append({
                    "invigilatorId": inv["id"],
                    "roomAssignmentId": room["id"],
                    "status": "ASSIGNED",
                    "assignedAt": datetime.now(timezone.utc).isoformat(),
                    "completedAt": None
                })
                assigned_count += 1

            if assigned_count >= 2:
                break

        while assigned_count < 2:
            assignments.append({
                "invigilatorId": None,
                "roomAssignmentId": room["id"],
                "status": "UNASSIGNED",
                "assignedAt": None,
                "completedAt": None
            })
            assigned_count += 1

    return assignments


def main():
    try:
        conn = get_db_connection()
        room_assignments = fetch_room_assignments(conn)
        invigilators = fetch_invigilators(conn)

        result = auto_assign_invigilators(room_assignments, invigilators)

        print(json.dumps(result, default=str))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
    finally:
        if conn:
            conn.close()


if __name__ == "__main__":
    main()