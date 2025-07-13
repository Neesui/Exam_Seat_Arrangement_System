/*
  Warnings:

  - The `startTime` column on the `exam` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `endTime` column on the `exam` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "exam" DROP COLUMN "startTime",
ADD COLUMN     "startTime" TIMESTAMP(3),
DROP COLUMN "endTime",
ADD COLUMN     "endTime" TIMESTAMP(3);
