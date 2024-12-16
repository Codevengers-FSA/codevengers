/*
  Warnings:

  - You are about to drop the column `watchedMovies` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "watchedMovies",
ADD COLUMN     "watched" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
