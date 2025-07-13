/*
  Warnings:

  - You are about to drop the `Exam` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "RoomAssignment" DROP CONSTRAINT "RoomAssignment_examId_fkey";

-- DropForeignKey
ALTER TABLE "SeatingPlan" DROP CONSTRAINT "SeatingPlan_examId_fkey";

-- DropTable
DROP TABLE "Exam";

-- CreateTable
CREATE TABLE "exam" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "exam_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "exam" ADD CONSTRAINT "exam_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomAssignment" ADD CONSTRAINT "RoomAssignment_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatingPlan" ADD CONSTRAINT "SeatingPlan_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
