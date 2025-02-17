/*
  Warnings:

  - Added the required column `blobUrl` to the `Script` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Script" ADD COLUMN     "blobUrl" TEXT NOT NULL;
