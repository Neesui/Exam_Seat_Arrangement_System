/*
  Warnings:

  - You are about to drop the `Seat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_benchId_fkey";

-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_seatingPlanId_fkey";

-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_studentId_fkey";

-- DropTable
DROP TABLE "Seat";

-- CreateTable
CREATE TABLE "seat" (
    "id" SERIAL NOT NULL,
    "benchId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "seatingPlanId" INTEGER,

    CONSTRAINT "seat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seat_studentId_key" ON "seat"("studentId");

-- AddForeignKey
ALTER TABLE "seat" ADD CONSTRAINT "seat_benchId_fkey" FOREIGN KEY ("benchId") REFERENCES "bench"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seat" ADD CONSTRAINT "seat_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seat" ADD CONSTRAINT "seat_seatingPlanId_fkey" FOREIGN KEY ("seatingPlanId") REFERENCES "SeatingPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
