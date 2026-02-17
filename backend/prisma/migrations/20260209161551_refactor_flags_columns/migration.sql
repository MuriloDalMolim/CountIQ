/*
  Warnings:

  - You are about to drop the column `inactiveflag` on the `company` table. All the data in the column will be lost.
  - You are about to alter the column `cnpj` on the `company` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(14)`.
  - You are about to drop the column `inactiveflag` on the `list` table. All the data in the column will be lost.
  - You are about to drop the column `inactiveflag` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `adminflag` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `inactiveflag` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "company" DROP COLUMN "inactiveflag",
ADD COLUMN     "isinactive" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "cnpj" SET DATA TYPE VARCHAR(14);

-- AlterTable
ALTER TABLE "count_item" ADD CONSTRAINT "count_item_pkey" PRIMARY KEY ("listcountid", "productid");

-- DropIndex
DROP INDEX "count_item_listcountid_productid_key";

-- AlterTable
ALTER TABLE "list" DROP COLUMN "inactiveflag",
ADD COLUMN     "isinactive" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "inactiveflag",
ADD COLUMN     "isinactive" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "adminflag",
DROP COLUMN "inactiveflag",
ADD COLUMN     "isadmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isinactive" BOOLEAN NOT NULL DEFAULT false;
