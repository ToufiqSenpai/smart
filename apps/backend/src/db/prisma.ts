import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

const connectionString = process.env.DIRECT_URL || '';

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});
