/*
  Warnings:

  - Added the required column `imageUrl` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "imageUrl" TEXT NOT NULL;
