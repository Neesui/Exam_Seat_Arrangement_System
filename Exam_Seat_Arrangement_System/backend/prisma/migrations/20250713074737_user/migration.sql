/*
  Warnings:

  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bench" DROP CONSTRAINT "Bench_roomId_fkey";

-- DropForeignKey
ALTER TABLE "RoomAssignment" DROP CONSTRAINT "RoomAssignment_roomId_fkey";

-- AlterTable
ALTER TABLE "Invigilator" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imageUrl" TEXT;

-- DropTable
DROP TABLE "Room";

-- CreateTable
CREATE TABLE "room" (
    "id" SERIAL NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "block" TEXT NOT NULL,
    "floor" TEXT NOT NULL,
    "totalBench" INTEGER NOT NULL DEFAULT 0,
    "totalCapacity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bench" ADD CONSTRAINT "Bench_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomAssignment" ADD CONSTRAINT "RoomAssignment_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
