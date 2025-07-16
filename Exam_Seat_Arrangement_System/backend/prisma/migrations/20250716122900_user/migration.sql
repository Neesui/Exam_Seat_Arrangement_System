/*
  Warnings:

  - Added the required column `updatedAt` to the `bench` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `invigilatorAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `roomAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `seat` table without a default value. This is not possible if the table is not empty.
  - Made the column `seatingPlanId` on table `seat` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `seatingPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `semester` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `subject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "seat" DROP CONSTRAINT "seat_seatingPlanId_fkey";

-- AlterTable
ALTER TABLE "bench" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "course" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "exam" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "invigilatorAssignment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "room" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "roomAssignment" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "seat" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "seatingPlanId" SET NOT NULL;

-- AlterTable
ALTER TABLE "seatingPlan" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "semester" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "subject" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "seat" ADD CONSTRAINT "seat_seatingPlanId_fkey" FOREIGN KEY ("seatingPlanId") REFERENCES "seatingPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
