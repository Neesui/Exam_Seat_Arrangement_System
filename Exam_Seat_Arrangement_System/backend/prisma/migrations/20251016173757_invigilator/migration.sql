/*
  Warnings:

  - You are about to drop the column `dateOfBirth` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `qualification` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `specialization` on the `course` table. All the data in the column will be lost.
  - Added the required column `dateOfBirth` to the `invigilator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `invigilator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qualification` to the `invigilator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialization` to the `invigilator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "course" DROP COLUMN "dateOfBirth",
DROP COLUMN "description",
DROP COLUMN "qualification",
DROP COLUMN "specialization";

-- AlterTable
ALTER TABLE "invigilator" ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "qualification" TEXT NOT NULL,
ADD COLUMN     "specialization" TEXT NOT NULL;
