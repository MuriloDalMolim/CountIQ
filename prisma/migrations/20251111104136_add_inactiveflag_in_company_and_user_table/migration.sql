-- AlterTable
ALTER TABLE "company" ADD COLUMN     "inactiveflag" TEXT NOT NULL DEFAULT 'F';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "inactiveflag" TEXT NOT NULL DEFAULT 'F';
