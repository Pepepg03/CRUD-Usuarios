import { PrismaClient } from '@prisma/client';

// Crear instancia global de Prisma para evitar múltiples conexiones en desarrollo
const globalForPrisma = globalThis ?? global;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}