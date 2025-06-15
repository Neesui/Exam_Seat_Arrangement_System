-- CreateTable
CREATE TABLE "invigilators" (
    "id" SERIAL NOT NULL,
    "department" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "invigilators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invigilators_userId_key" ON "invigilators"("userId");

-- AddForeignKey
ALTER TABLE "invigilators" ADD CONSTRAINT "invigilators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
