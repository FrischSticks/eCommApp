// This code allows Prisma to run with Next JS & Vercel (Prisma Docs)

import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate());
};

declare const globalThis: {
  prisma: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const db = globalThis.prisma ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
// Global Variable = prisma
// Local Variable = db