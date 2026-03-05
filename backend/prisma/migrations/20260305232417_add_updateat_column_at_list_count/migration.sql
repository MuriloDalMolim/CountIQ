/*
  Warnings:

  - Added the required column `updateat` to the `list_count` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "list_count" ADD COLUMN     "updateat" TIMESTAMP(3) NOT NULL;
