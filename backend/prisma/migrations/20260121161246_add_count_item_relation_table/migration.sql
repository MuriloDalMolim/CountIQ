-- CreateTable
CREATE TABLE "count_item" (
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "updateat" TIMESTAMP(3) NOT NULL,
    "listcountid" INTEGER NOT NULL,
    "productid" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "count_item_listcountid_productid_key" ON "count_item"("listcountid", "productid");

-- AddForeignKey
ALTER TABLE "count_item" ADD CONSTRAINT "count_item_listcountid_fkey" FOREIGN KEY ("listcountid") REFERENCES "list_count"("listcountid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "count_item" ADD CONSTRAINT "count_item_productid_fkey" FOREIGN KEY ("productid") REFERENCES "product"("productid") ON DELETE RESTRICT ON UPDATE CASCADE;
