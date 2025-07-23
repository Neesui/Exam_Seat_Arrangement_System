/*
  Warnings:

  - A unique constraint covering the columns `[studentId,seatingPlanId]` on the table `seat` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "seat_studentId_key";

-- CreateIndex
CREATE UNIQUE INDEX "seat_studentId_seatingPlanId_key" ON "seat"("studentId", "seatingPlanId");
