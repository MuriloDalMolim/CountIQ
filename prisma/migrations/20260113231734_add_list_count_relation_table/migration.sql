-- CreateTable
CREATE TABLE "list_count" (
    "listcountid" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Aberta',
    "listid" INTEGER NOT NULL,
    "userid" INTEGER NOT NULL,

    CONSTRAINT "list_count_pkey" PRIMARY KEY ("listcountid")
);

-- AddForeignKey
ALTER TABLE "list_count" ADD CONSTRAINT "list_count_listid_fkey" FOREIGN KEY ("listid") REFERENCES "list"("listid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_count" ADD CONSTRAINT "list_count_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;
