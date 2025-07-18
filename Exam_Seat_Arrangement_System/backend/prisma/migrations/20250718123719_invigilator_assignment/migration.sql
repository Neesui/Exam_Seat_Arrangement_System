-- DropForeignKey
ALTER TABLE "invigilatorAssignment" DROP CONSTRAINT "invigilatorAssignment_roomAssignmentId_fkey";

-- AddForeignKey
ALTER TABLE "invigilatorAssignment" ADD CONSTRAINT "invigilatorAssignment_roomAssignmentId_fkey" FOREIGN KEY ("roomAssignmentId") REFERENCES "roomAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
