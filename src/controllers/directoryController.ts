import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { transporter } from '../config/email';
import path from 'path';

const prisma = new PrismaClient();

const DIRECTORY_PDF_FILENAME = 'IBIEA_2025_DIRECTORY.pdf';
const DIRECTORY_PDF_PATH = path.join(process.cwd(), 'public/assets/email-assets', DIRECTORY_PDF_FILENAME);
const DIRECTORY_PDF_URL = '/assets/email-assets/IBIEA_2025_DIRECTORY.pdf';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const EMAIL_USER = process.env.EMAIL_USER || '';

export const requestDirectory = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] [requestDirectory] Start request for:`, { name, email });
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  try {
    console.log(`[${new Date().toISOString()}] [requestDirectory] Saving to DB...`);
    await prisma.directoryRequest.create({
      data: { name, email }
    });
    console.log(`[${new Date().toISOString()}] [requestDirectory] Saved to DB.`);

    console.log(`[${new Date().toISOString()}] [requestDirectory] Sending admin email...`);
    await transporter.sendMail({
      from: EMAIL_USER,
      to: ADMIN_EMAIL,
      subject: 'New Directory Download Request',
      html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p>`
    });
    console.log(`[${new Date().toISOString()}] [requestDirectory] Admin email sent.`);

    const end = Date.now();
    console.log(`[${new Date().toISOString()}] [requestDirectory] Finished. Total time: ${end - start}ms`);
    return res.status(200).json({ 
      message: 'Thank you! You can now download the directory.',
      downloadUrl: DIRECTORY_PDF_URL
    });
  } catch (error: any) {
    console.error(`[${new Date().toISOString()}] [requestDirectory] Error:`, error);
    return res.status(500).json({ error: 'Failed to process request.' });
  }
}; 