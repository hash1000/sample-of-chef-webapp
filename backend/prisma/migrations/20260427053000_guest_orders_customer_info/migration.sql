-- AlterTable
ALTER TABLE "Order"
ADD COLUMN     "customerName" TEXT NOT NULL DEFAULT 'Guest Customer',
ADD COLUMN     "customerEmail" TEXT NOT NULL DEFAULT 'guest@example.test',
ADD COLUMN     "customerPhone" TEXT NOT NULL DEFAULT '0000000000',
ALTER COLUMN   "userId" DROP NOT NULL;
