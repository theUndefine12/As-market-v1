-- AlterTable
ALTER TABLE "User" ADD COLUMN     "voucherId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "Voucher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
