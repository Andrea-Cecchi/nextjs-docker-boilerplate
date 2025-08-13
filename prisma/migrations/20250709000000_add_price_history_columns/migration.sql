-- Add new price columns to price_history table
ALTER TABLE "price_history" ADD COLUMN "ssnReferencePrice" DECIMAL(10,3);
ALTER TABLE "price_history" ADD COLUMN "publicPrice" DECIMAL(10,3);

-- For backward compatibility, copy existing price to ssnReferencePrice
UPDATE "price_history" SET "ssnReferencePrice" = "price";

-- Make ssnReferencePrice NOT NULL after data migration
ALTER TABLE "price_history" ALTER COLUMN "ssnReferencePrice" SET NOT NULL;

-- Drop old price column
ALTER TABLE "price_history" DROP COLUMN "price";