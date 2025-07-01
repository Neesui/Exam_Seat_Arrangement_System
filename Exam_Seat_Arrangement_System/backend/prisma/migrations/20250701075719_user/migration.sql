/*
  Warnings:

  - You are about to drop the column `number` on the `Semester` table. All the data in the column will be lost.
  - Added the required column `semesterNum` to the `Semester` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Semester" DROP COLUMN "number",
ADD COLUMN     "semesterNum" INTEGER NOT NULL;
