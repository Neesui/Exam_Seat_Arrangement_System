/*
  Warnings:

  - You are about to drop the column `generationId` on the `invigilatorAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `invigilatorId` on the `invigilatorAssignment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "invigilatorAssignment" DROP CONSTRAINT "invigilatorAssignment_invigilatorId_fkey";

-- AlterTable
ALTER TABLE "invigilatorAssignment" DROP COLUMN "generationId",
DROP COLUMN "invigilatorId";

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
ALTER TABLE "invigilatorOnAssignment" ADD CONSTRAINT "invigilatorOnAssignment_invigilatorId_fkey" FOREIGN KEY ("invigilatorId") REFERENCES "invigilator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invigilatorOnAssignment" ADD CONSTRAINT "invigilatorOnAssignment_invigilatorAssignmentId_fkey" FOREIGN KEY ("invigilatorAssignmentId") REFERENCES "invigilatorAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
