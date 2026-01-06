-- CreateTable
CREATE TABLE "list" (
    "listid" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "companyid" INTEGER NOT NULL,
    "inactiveflag" CHAR(1) NOT NULL DEFAULT 'F',

    CONSTRAINT "list_pkey" PRIMARY KEY ("listid")
);

-- AddForeignKey
ALTER TABLE "list" ADD CONSTRAINT "list_companyid_fkey" FOREIGN KEY ("companyid") REFERENCES "company"("companyid") ON DELETE RESTRICT ON UPDATE CASCADE;
