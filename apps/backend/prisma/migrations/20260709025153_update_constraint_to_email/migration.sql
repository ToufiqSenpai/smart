/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `masyarakat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `masyarakat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "laporan_kendala" DROP CONSTRAINT "laporan_kendala_id_pengurus_fkey";

-- AlterTable
ALTER TABLE "laporan_kendala" ALTER COLUMN "id_pengurus" DROP NOT NULL;

-- AlterTable
ALTER TABLE "masyarakat" ADD COLUMN     "email" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "masyarakat_email_key" ON "masyarakat"("email");

-- AddForeignKey
ALTER TABLE "laporan_kendala" ADD CONSTRAINT "laporan_kendala_id_pengurus_fkey" FOREIGN KEY ("id_pengurus") REFERENCES "pengurus_rt"("id_pengurus") ON DELETE SET NULL ON UPDATE CASCADE;
