import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient as PrismaClient1 } from '../../generated/client1';
import { PrismaClient as PrismaClient2 } from '../../generated/client2';

// Configurar pool y adapter para Base de Datos 1
const pool1 = new Pool({ connectionString: process.env.DATABASE_URL_1 });
const adapter1 = new PrismaPg(pool1);
export const prisma1 = new PrismaClient1({ adapter: adapter1 });

// Configurar pool y adapter para Base de Datos 2
const pool2 = new Pool({ connectionString: process.env.DATABASE_URL_2 });
const adapter2 = new PrismaPg(pool2);
export const prisma2 = new PrismaClient2({ adapter: adapter2 });
