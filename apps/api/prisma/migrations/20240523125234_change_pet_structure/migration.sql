/*
  Warnings:

  - You are about to drop the column `adopted` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `environment` on the `pets` table. All the data in the column will be lost.
  - Added the required column `environment_size` to the `pets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PetEnvironmentSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "PetAdoptionStatus" AS ENUM ('PENDING', 'ADOPTED', 'NOT_ADOPTED');

-- AlterTable
ALTER TABLE "pets" DROP COLUMN "adopted",
DROP COLUMN "environment",
ADD COLUMN     "adoption_status" "PetAdoptionStatus" NOT NULL DEFAULT 'NOT_ADOPTED',
ADD COLUMN     "environment_size" "PetEnvironmentSize" NOT NULL;

-- DropEnum
DROP TYPE "PetEnvironment";
