/*
  Warnings:

  - You are about to drop the `invigilatorOnAssignment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "invigilatorOnAssignment" DROP CONSTRAINT "invigilatorOnAssignment_invigilatorAssignmentId_fkey";

-- DropForeignKey
ALTER TABLE "invigilatorOnAssignment" DROP CONSTRAINT "invigilatorOnAssignment_invigilatorId_fkey";

-- DropIndex
DROP INDEX "course_name_key";

-- DropTable
DROP TABLE "invigilatorOnAssignment";

-- CreateTable
CREATE TABLE "_AssignmentInvigilators" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AssignmentInvigilators_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AssignmentInvigilators_B_index" ON "_AssignmentInvigilators"("B");

-- AddForeignKey
ALTER TABLE "_AssignmentInvigilators" ADD CONSTRAINT "_AssignmentInvigilators_A_fkey" FOREIGN KEY ("A") REFERENCES "invigilator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssignmentInvigilators" ADD CONSTRAINT "_AssignmentInvigilators_B_fkey" FOREIGN KEY ("B") REFERENCES "invigilatorAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
