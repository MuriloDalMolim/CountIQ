-- CreateTable
CREATE TABLE "user" (
    "userid" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyid" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("userid")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_companyid_fkey" FOREIGN KEY ("companyid") REFERENCES "company"("companyid") ON DELETE RESTRICT ON UPDATE CASCADE;
