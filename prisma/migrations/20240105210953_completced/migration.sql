-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "purchasedId" INTEGER;

-- CreateTable
CREATE TABLE "Purchased" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Purchased_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_purchasedId_fkey" FOREIGN KEY ("purchasedId") REFERENCES "Purchased"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchased" ADD CONSTRAINT "Purchased_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
