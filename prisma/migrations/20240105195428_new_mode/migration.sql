/*
  Warnings:

  - You are about to drop the `Coupon` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Coupon";

-- CreateTable
CREATE TABLE "Vaucher" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Vaucher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vaucher_code_key" ON "Vaucher"("code");
