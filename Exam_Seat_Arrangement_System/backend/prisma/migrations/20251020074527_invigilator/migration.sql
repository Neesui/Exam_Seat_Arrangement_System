/*
  Warnings:

  - Made the column `email` on table `student` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "invigilator" ALTER COLUMN "dateOfBirth" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "qualification" DROP NOT NULL,
ALTER COLUMN "specialization" DROP NOT NULL;

-- AlterTable
ALTER TABLE "student" ALTER COLUMN "email" SET NOT NULL;
