-- CreateTable
CREATE TABLE "product_list" (
    "listid" INTEGER NOT NULL,
    "productid" INTEGER NOT NULL,

    CONSTRAINT "product_list_pkey" PRIMARY KEY ("listid","productid")
);

-- AddForeignKey
ALTER TABLE "product_list" ADD CONSTRAINT "product_list_listid_fkey" FOREIGN KEY ("listid") REFERENCES "list"("listid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_list" ADD CONSTRAINT "product_list_productid_fkey" FOREIGN KEY ("productid") REFERENCES "product"("productid") ON DELETE RESTRICT ON UPDATE CASCADE;
