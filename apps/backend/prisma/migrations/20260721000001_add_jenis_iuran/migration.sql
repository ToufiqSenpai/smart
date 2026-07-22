-- AlterTable: Add jenis_iuran column to iuran table
ALTER TABLE "iuran" ADD COLUMN "jenis_iuran" VARCHAR(15) NOT NULL DEFAULT 'Wajib';
