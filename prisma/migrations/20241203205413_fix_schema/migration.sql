/*
  Warnings:

  - You are about to drop the `_UserToWatchlist` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ownerId` to the `Watchlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_UserToWatchlist" DROP CONSTRAINT "_UserToWatchlist_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToWatchlist" DROP CONSTRAINT "_UserToWatchlist_B_fkey";

-- AlterTable
ALTER TABLE "Watchlist" ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_UserToWatchlist";

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
