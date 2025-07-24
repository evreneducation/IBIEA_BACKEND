import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateUniqueCode(): Promise<string> {
  const prefix = 'IBIEA';
  const year = '25'; // for 2025
  let isUnique = false;
  let code = '';

  while (!isUnique) {
    // Generate a random 4-digit number
    const random = Math.floor(1000 + Math.random() * 9000);
    code = `${prefix}-${year}-${random}`;

    // Check if code already exists
    const existingParticipant = await prisma.participant.findUnique({
      where: { verificationCode: code }
    });

    if (!existingParticipant) {
      isUnique = true;
    }
  }

  return code;
} 