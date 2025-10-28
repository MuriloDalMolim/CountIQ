-- CreateTable
CREATE TABLE "company" (
    "companyid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("companyid")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_cnpj_key" ON "company"("cnpj");
