ALTER TABLE "Order" ADD COLUMN "deliveryAddress" TEXT;
ALTER TABLE "Order" ADD COLUMN "paymentMethod" TEXT NOT NULL DEFAULT 'mock';
