/*
  Warnings:

  - A unique constraint covering the columns `[adoption_code]` on the table `adoptions` will be added. If there are existing duplicate values, this will fail.
  - The required column `adoption_code` was added to the `adoptions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "adoptions" ADD COLUMN     "adoption_code" TEXT NOT NULL,
ADD COLUMN     "confirmed_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "adoptions_adoption_code_key" ON "adoptions"("adoption_code");
