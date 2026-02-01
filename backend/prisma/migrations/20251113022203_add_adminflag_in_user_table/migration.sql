/*
  Warnings:

  - You are about to alter the column `inactiveflag` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(1)`.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "adminflag" CHAR(1) NOT NULL DEFAULT 'F',
ALTER COLUMN "inactiveflag" SET DATA TYPE CHAR(1);
