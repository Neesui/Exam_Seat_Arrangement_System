/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dateOfBirth` to the `course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qualification` to the `course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialization` to the `course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "course" ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "qualification" TEXT NOT NULL,
ADD COLUMN     "specialization" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "student" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "student_email_key" ON "student"("email");
