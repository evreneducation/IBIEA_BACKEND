import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { sendNominationRegistrationEmail } from '../services/emailService';
import { io } from '..';

const router = express.Router();
const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed'));
    }
  },
});

// Submit a nomination
router.post('/nominate', upload.single('supportingDocs'), async (req, res) => {
  try {
    const {
      fullName,
      designation,
      organization,
      industry,
      country,
      email,
      phone,
      category,
      achievements,
      contributions,
      awards,
    } = req.body;

    let fileUrl = null;
    if (req.file) {
      // Convert buffer to base64
      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      
      // Get file extension
      const fileExt = req.file.originalname.split('.').pop()?.toLowerCase();
      
      // Upload to Cloudinary with minimal configuration
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        folder: 'ibiea-nominations',
        resource_type: 'raw',
        public_id: `nomination_${Date.now()}`,
        format: fileExt
      });

      // Use the secure URL directly
      fileUrl = uploadResponse.secure_url;
    }

    const nomination = await prisma.nomination.create({
      data: {
        fullName,
        designation,
        organization,
        industry,
        country,
        email,
        phone,
        category,
        achievements,
        contributions,
        awards: awards || null,
        supportingDocs: fileUrl,
      },
    });

    io.emit("newNomination", nomination);

    // Return the nomination with additional file metadata
    const response = {
      ...nomination,
      fileMetadata: req.file ? {
        filename: req.file.originalname,
        mimetype: req.file.mimetype
      } : null
    };

    await sendNominationRegistrationEmail(nomination)

    res.status(201).json(response);
  } catch (error) {
    console.error('Error submitting nomination:', error);
    res.status(500).json({ error: 'Failed to submit nomination' });
  }
});

export default router; 