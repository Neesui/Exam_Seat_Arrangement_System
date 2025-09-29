/*
  Warnings:

  - The `status` column on the `invigilatorAssignment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "invigilatorAssignment" DROP COLUMN "status",
ADD COLUMN     "status" "InvigilatorStatus" NOT NULL DEFAULT 'ASSIGNED';
