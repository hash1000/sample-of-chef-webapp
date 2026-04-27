-- CreateEnum
CREATE TYPE "City" AS ENUM ('islamabad', 'karachi', 'lahore');

-- CreateEnum
CREATE TYPE "RestaurantStatus" AS ENUM ('pending', 'approved', 'rejected', 'blocked');

-- AlterTable
ALTER TABLE "Restaurant"
ADD COLUMN     "city" "City" NOT NULL DEFAULT 'lahore',
ADD COLUMN     "status" "RestaurantStatus" NOT NULL DEFAULT 'approved',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "menuType" TEXT;

-- Keep existing rows visible, but make new restaurants pending by default.
ALTER TABLE "Restaurant" ALTER COLUMN "status" SET DEFAULT 'pending';

-- CreateIndex
CREATE INDEX "Restaurant_city_status_isActive_idx" ON "Restaurant"("city", "status", "isActive");
