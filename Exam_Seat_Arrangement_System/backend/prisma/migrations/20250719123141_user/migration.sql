/*
  Warnings:

  - The required column `generationId` was added to the `invigilatorAssignment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "invigilatorAssignment" ADD COLUMN     "generationId" TEXT NOT NULL;
