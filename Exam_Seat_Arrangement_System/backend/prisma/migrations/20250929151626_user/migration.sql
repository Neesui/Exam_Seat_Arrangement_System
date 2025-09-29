/*
  Warnings:

  - You are about to drop the `_AssignmentInvigilators` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AssignmentInvigilators" DROP CONSTRAINT "_AssignmentInvigilators_A_fkey";

-- DropForeignKey
ALTER TABLE "_AssignmentInvigilators" DROP CONSTRAINT "_AssignmentInvigilators_B_fkey";

-- DropForeignKey
ALTER TABLE "invigilatorAssignment" DROP CONSTRAINT "invigilatorAssignment_roomAssignmentId_fkey";

-- AlterTable
ALTER TABLE "seatingPlan" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "_AssignmentInvigilators";

-- CreateTable
CREATE TABLE "invigilatorOnAssignment" (
    "id" SERIAL NOT NULL,
    "invigilatorId" INTEGER NOT NULL,
    "invigilatorAssignmentId" INTEGER NOT NULL,

    CONSTRAINT "invigilatorOnAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invigilatorOnAssignment_invigilatorId_invigilatorAssignment_key" ON "invigilatorOnAssignment"("invigilatorId", "invigilatorAssignmentId");

-- AddForeignKey
ALTER TABLE "invigilatorAssignment" ADD CONSTRAINT "invigilatorAssignment_roomAssignmentId_fkey" FOREIGN KEY ("roomAssignmentId") REFERENCES "roomAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invigilatorOnAssignment" ADD CONSTRAINT "invigilatorOnAssignment_invigilatorId_fkey" FOREIGN KEY ("invigilatorId") REFERENCES "invigilator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invigilatorOnAssignment" ADD CONSTRAINT "invigilatorOnAssignment_invigilatorAssignmentId_fkey" FOREIGN KEY ("invigilatorAssignmentId") REFERENCES "invigilatorAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
