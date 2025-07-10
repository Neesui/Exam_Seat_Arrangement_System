/*
  Warnings:

  - A unique constraint covering the columns `[roomId,benchNo]` on the table `Bench` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bench_roomId_benchNo_key" ON "Bench"("roomId", "benchNo");
