/*
  Warnings:

  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invigilator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvigilatorAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoomAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SeatingPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Semester` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Invigilator" DROP CONSTRAINT "Invigilator_userId_fkey";

-- DropForeignKey
ALTER TABLE "InvigilatorAssignment" DROP CONSTRAINT "InvigilatorAssignment_invigilatorId_fkey";

-- DropForeignKey
ALTER TABLE "InvigilatorAssignment" DROP CONSTRAINT "InvigilatorAssignment_roomAssignmentId_fkey";

-- DropForeignKey
ALTER TABLE "RoomAssignment" DROP CONSTRAINT "RoomAssignment_examId_fkey";

-- DropForeignKey
ALTER TABLE "RoomAssignment" DROP CONSTRAINT "RoomAssignment_roomId_fkey";

-- DropForeignKey
ALTER TABLE "SeatingPlan" DROP CONSTRAINT "SeatingPlan_examId_fkey";

-- DropForeignKey
ALTER TABLE "Semester" DROP CONSTRAINT "Semester_courseId_fkey";

-- DropForeignKey
ALTER TABLE "seat" DROP CONSTRAINT "seat_seatingPlanId_fkey";

-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_courseId_fkey";

-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "subject" DROP CONSTRAINT "subject_semesterId_fkey";

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "Invigilator";

-- DropTable
DROP TABLE "InvigilatorAssignment";

-- DropTable
DROP TABLE "RoomAssignment";

-- DropTable
DROP TABLE "SeatingPlan";

-- DropTable
DROP TABLE "Semester";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'INVIGILATOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invigilator" (
    "id" SERIAL NOT NULL,
    "course" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "invigilator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "batchYear" INTEGER NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "semester" (
    "id" SERIAL NOT NULL,
    "semesterNum" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "semester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roomAssignment" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "examId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "roomAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invigilatorAssignment" (
    "id" SERIAL NOT NULL,
    "invigilatorId" INTEGER NOT NULL,
    "roomAssignmentId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ASSIGNED',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "invigilatorAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seatingPlan" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "seatingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "invigilator_userId_key" ON "invigilator"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "course_name_key" ON "course"("name");

-- CreateIndex
CREATE UNIQUE INDEX "course_name_batchYear_key" ON "course"("name", "batchYear");

-- AddForeignKey
ALTER TABLE "invigilator" ADD CONSTRAINT "invigilator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semester" ADD CONSTRAINT "semester_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject" ADD CONSTRAINT "subject_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seat" ADD CONSTRAINT "seat_seatingPlanId_fkey" FOREIGN KEY ("seatingPlanId") REFERENCES "seatingPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roomAssignment" ADD CONSTRAINT "roomAssignment_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roomAssignment" ADD CONSTRAINT "roomAssignment_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invigilatorAssignment" ADD CONSTRAINT "invigilatorAssignment_invigilatorId_fkey" FOREIGN KEY ("invigilatorId") REFERENCES "invigilator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invigilatorAssignment" ADD CONSTRAINT "invigilatorAssignment_roomAssignmentId_fkey" FOREIGN KEY ("roomAssignmentId") REFERENCES "roomAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seatingPlan" ADD CONSTRAINT "seatingPlan_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
