/*
  Warnings:

  - Made the column `releaseDate` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `chronologicalOrder` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `chronologicalOrder` to the `Watchlist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "releaseDate" SET NOT NULL,
ALTER COLUMN "releaseDate" DROP DEFAULT,
ALTER COLUMN "releaseDate" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "chronologicalOrder" SET NOT NULL,
ALTER COLUMN "chronologicalOrder" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Watchlist" ADD COLUMN     "chronologicalOrder" INTEGER NOT NULL;
