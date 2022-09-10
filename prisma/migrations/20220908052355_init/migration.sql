/*
  Warnings:

  - You are about to alter the column `amount` on the `Pantry` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.
  - You are about to alter the column `amount` on the `Recipe_ingredient` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.

*/
-- AlterTable
ALTER TABLE "Pantry" ALTER COLUMN "amount" SET DATA TYPE INT4;

-- AlterTable
ALTER TABLE "Recipe_ingredient" ALTER COLUMN "amount" SET DATA TYPE INT4;
