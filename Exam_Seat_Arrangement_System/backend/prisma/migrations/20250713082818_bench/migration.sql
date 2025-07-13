/*
  Warnings:

  - You are about to drop the `Bench` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bench" DROP CONSTRAINT "Bench_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_benchId_fkey";

-- DropTable
DROP TABLE "Bench";

-- CreateTable
CREATE TABLE "bench" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "benchNo" INTEGER NOT NULL,
    "row" INTEGER NOT NULL,
    "column" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bench_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bench_roomId_row_column_key" ON "bench"("roomId", "row", "column");

-- CreateIndex
CREATE UNIQUE INDEX "bench_roomId_benchNo_key" ON "bench"("roomId", "benchNo");

-- AddForeignKey
ALTER TABLE "bench" ADD CONSTRAINT "bench_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_benchId_fkey" FOREIGN KEY ("benchId") REFERENCES "bench"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
