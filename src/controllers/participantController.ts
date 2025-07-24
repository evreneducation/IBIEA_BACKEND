import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendParticipantRegistrationEmail } from "../services/emailService";
import { generateUniqueCode } from "../utils/codeGenerator";
import { generateParticipantPDF } from "../utils/pdfGenerator";
import { io } from "../index";

const prisma = new PrismaClient();

// export const createParticipantApplication = async (req: Request, res: Response) => {
//   try {
//     const {
//       fullName,
//       designation,
//       organization,
//       email,
//       phone,
//       category,
//       message,
//       supportingDocs
//     } = req.body;

//     // Generate unique verification code
//     const verificationCode = await generateUniqueCode();

//     const participant = await prisma.participant.create({
//       data: {
//         fullName,
//         designation,
//         organization,
//         email,
//         phone,
//         category,
//         message,
//         supportingDocs,
//         verificationCode,
//       },
//     });

//     // Generate PDF
//     const pdfBuffer = await generateParticipantPDF(participant);

//     // Send confirmation emails with PDF attachment
//     await sendParticipantRegistrationEmail(participant, pdfBuffer);

//     res.status(201).json(participant);
//   } catch (error) {
//     console.error('Error creating participant application:', error);
//     res.status(500).json({ error: 'Failed to create participant application' });
//   }
// };

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function retryOperation(
  operation: () => Promise<void>,
  retryCount = 0
): Promise<void> {
  try {
    await operation();
  } catch (error) {
    if (retryCount >= MAX_RETRIES) {
      console.error(`Failed after ${MAX_RETRIES} retries:`, error);
      throw error;
    }

    const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
    console.log(`Retry attempt ${retryCount + 1} after ${delay}ms`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryOperation(operation, retryCount + 1);
  }
}

export const createParticipantApplication = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      fullName,
      designation,
      organization,
      email,
      phone,
      category,
      message,
      supportingDocs,
    } = req.body;

    // Generate unique verification code
    const verificationCode = await generateUniqueCode();

    const participant = await prisma.participant.create({
      data: {
        fullName,
        designation,
        organization,
        email,
        phone,
        category,
        message,
        supportingDocs,
        verificationCode,
      },
    });

    // Send immediate success response
    res.status(201).json(participant);

    // Emit new participant event
    io.emit("newParticipant", participant);

    // Handle PDF generation and email sending asynchronously with retries
    (async () => {
      try {
        await retryOperation(async () => {
          const pdfBuffer = await generateParticipantPDF(participant);
          await sendParticipantRegistrationEmail(participant, pdfBuffer);
        });
        console.log(
          `Successfully sent email to participant: ${participant.email}`
        );
      } catch (error) {
        console.error("All retry attempts failed for participant:", {
          participantId: participant.id,
          email: participant.email,
          error,
        });
      }
    })();
  } catch (error) {
    console.error("Error creating participant application:", error);
    res.status(500).json({ error: "Failed to create participant application" });
  }
};

export const getApprovedParticipants = async (_req: Request, res: Response) => {
  try {
    const participants = await prisma.participant.findMany({
      where: {
        status: "APPROVED",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(participants);
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({ error: "Failed to fetch participants" });
  }
};

export const verifyParticipant = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    const participant = await prisma.participant.findUnique({
      where: { verificationCode: code },
    });

    if (!participant) {
      return res.status(404).json({ error: "Invalid verification code" });
    }

    if (participant.isVerified) {
      return res.status(400).json({ error: "Participant already verified" });
    }

    const updatedParticipant = await prisma.participant.update({
      where: { id: participant.id },
      data: { isVerified: true },
    });

    res.json(updatedParticipant);
  } catch (error) {
    console.error("Error verifying participant:", error);
    res.status(500).json({ error: "Failed to verify participant" });
  }
};

export const getAllParticipants = async (_req: Request, res: Response) => {
  try {
    const participants = await prisma.participant.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(participants);
  } catch (error) {
    console.error("Error fetching all participants:", error);
    res.status(500).json({ error: "Failed to fetch participants" });
  }
};

export const getParticipantById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const participant = await prisma.participant.findUnique({
      where: { id: parseInt(id) },
    });

    res.json(participant);
  } catch (error) {
    console.error("Error fetching participant details:", error);
    res.status(500).json({ error: "Failed to fetch participant details" });
  }
};

export const deleteParticipant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.participant.delete({
      where: { id: parseInt(id) },
    });

    io.emit("participantDeleted", { id });

    res.json({ message: "Participant deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
