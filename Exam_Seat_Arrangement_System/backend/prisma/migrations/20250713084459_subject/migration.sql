/*
  Warnings:

  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "exam" DROP CONSTRAINT "exam_subjectId_fkey";

-- DropTable
DROP TABLE "Subject";

-- CreateTable
CREATE TABLE "subject" (
    "id" SERIAL NOT NULL,
    "subjectName" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "semesterId" INTEGER NOT NULL,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subject_code_key" ON "subject"("code");

-- AddForeignKey
ALTER TABLE "subject" ADD CONSTRAINT "subject_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam" ADD CONSTRAINT "exam_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
