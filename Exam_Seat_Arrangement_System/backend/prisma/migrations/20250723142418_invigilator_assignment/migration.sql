/*
  Warnings:

  - You are about to drop the column `isActive` on the `roomAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `roomAssignment` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RoomAssignmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "InvigilatorStatus" AS ENUM ('ASSIGNED', 'COMPLETED');

-- AlterTable
ALTER TABLE "roomAssignment" DROP COLUMN "isActive",
DROP COLUMN "isCompleted",
ADD COLUMN     "status" "RoomAssignmentStatus" NOT NULL DEFAULT 'ACTIVE';
