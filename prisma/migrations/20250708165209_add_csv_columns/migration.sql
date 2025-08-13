/*
  Migration to add CSV columns to drug table
  Handle existing data by setting referencePackage to pack value initially
*/

-- AlterTable: Add optional columns first
ALTER TABLE "drug" ADD COLUMN     "atc" TEXT,
ADD COLUMN     "equivalenceGroupCode" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "priceDifference" DECIMAL(10,3),
ADD COLUMN     "publicPrice" DECIMAL(10,3),
ADD COLUMN     "ssnReferencePrice" DECIMAL(10,3);

-- Add referencePackage as nullable first
ALTER TABLE "drug" ADD COLUMN "referencePackage" TEXT;

-- Update existing rows to use pack as referencePackage
UPDATE "drug" SET "referencePackage" = "pack" WHERE "referencePackage" IS NULL;

-- Now make it NOT NULL
ALTER TABLE "drug" ALTER COLUMN "referencePackage" SET NOT NULL;
