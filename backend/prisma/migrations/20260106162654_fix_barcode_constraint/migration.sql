/*
  Warnings:

  - A unique constraint covering the columns `[companyid,barcode]` on the table `product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "product_barcode_key";

-- CreateIndex
CREATE UNIQUE INDEX "product_companyid_barcode_key" ON "product"("companyid", "barcode");
