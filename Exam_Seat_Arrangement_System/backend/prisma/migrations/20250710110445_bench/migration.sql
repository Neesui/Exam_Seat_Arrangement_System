/*
  Warnings:

  - A unique constraint covering the columns `[roomId,row,column]` on the table `Bench` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `column` to the `Bench` table without a default value. This is not possible if the table is not empty.
  - Added the required column `row` to the `Bench` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bench" ADD COLUMN     "column" INTEGER NOT NULL,
ADD COLUMN     "row" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "maxColumns" INTEGER NOT NULL DEFAULT 2;

-- CreateIndex
CREATE UNIQUE INDEX "Bench_roomId_row_column_key" ON "Bench"("roomId", "row", "column");
