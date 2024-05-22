/*
  Warnings:

  - You are about to drop the column `city` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `complement` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `neighborhood` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `zipcode` on the `organizations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[adopter_email]` on the table `adoptions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adopter_email` to the `adoptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_address_id` to the `pets` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "organizations_city_idx";

-- AlterTable
ALTER TABLE "adoptions" ADD COLUMN     "adopter_email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "city",
DROP COLUMN "complement",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "neighborhood",
DROP COLUMN "number",
DROP COLUMN "state",
DROP COLUMN "street",
DROP COLUMN "zipcode";

-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "organization_address_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "organization_addresses" (
    "id" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "longitude" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "complement" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "organization_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "organization_addresses_city_idx" ON "organization_addresses"("city");

-- CreateIndex
CREATE UNIQUE INDEX "adoptions_adopter_email_key" ON "adoptions"("adopter_email");

-- AddForeignKey
ALTER TABLE "organization_addresses" ADD CONSTRAINT "organization_addresses_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_organization_address_id_fkey" FOREIGN KEY ("organization_address_id") REFERENCES "organization_addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
