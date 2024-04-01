/*
  Warnings:

  - You are about to drop the `Vaucher` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Vaucher";

-- CreateTable
CREATE TABLE "Voucher" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "cash" INTEGER NOT NULL,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_code_key" ON "Voucher"("code");
