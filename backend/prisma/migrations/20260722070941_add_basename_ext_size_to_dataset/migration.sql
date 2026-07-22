/*
  Warnings:

  - Added the required column `baseName` to the `datasets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ext` to the `datasets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeBytes` to the `datasets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "datasets" ADD COLUMN     "baseName" TEXT NOT NULL,
ADD COLUMN     "ext" TEXT NOT NULL,
ADD COLUMN     "sizeBytes" TEXT NOT NULL;
