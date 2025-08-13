-- CreateTable
CREATE TABLE "drug" (
    "id" VARCHAR(9) NOT NULL,
    "activeSubstance" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "pack" TEXT NOT NULL,
    "holder" TEXT,

    CONSTRAINT "drug_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_history" (
    "id" SERIAL NOT NULL,
    "drugId" VARCHAR(9) NOT NULL,
    "date" DATE NOT NULL,
    "price" DECIMAL(10,3) NOT NULL,

    CONSTRAINT "price_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "drugId" VARCHAR(9) NOT NULL,

    CONSTRAINT "favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "price_history_drugId_date_key" ON "price_history"("drugId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_userId_drugId_key" ON "favorite"("userId", "drugId");

-- AddForeignKey
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
