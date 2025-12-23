-- CreateTable
CREATE TABLE "product" (
    "productid" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "inactiveflag" CHAR(1) NOT NULL DEFAULT 'F',
    "companyid" INTEGER NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("productid")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_barcode_key" ON "product"("barcode");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_companyid_fkey" FOREIGN KEY ("companyid") REFERENCES "company"("companyid") ON DELETE RESTRICT ON UPDATE CASCADE;
