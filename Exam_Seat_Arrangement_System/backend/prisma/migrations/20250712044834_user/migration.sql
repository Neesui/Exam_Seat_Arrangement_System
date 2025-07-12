/*
  Warnings:

  - You are about to drop the column `name` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,batchYear]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `batchYear` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentName` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "batchYear" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "name",
ADD COLUMN     "studentName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_batchYear_key" ON "Course"("name", "batchYear");
