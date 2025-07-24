import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendSponsorRegistrationEmail } from "../services/emailService";
import { io } from "..";

const prisma = new PrismaClient();

export const createSponsorApplication = async (req: Request, res: Response) => {
  try {
    const {
      companyName,
      contactPerson,
      email,
      phone,
      sponsorshipType,
      message,
      contribution,
    } = req.body;

    const sponsor = await prisma.sponsor.create({
      data: {
        companyName,
        contactPerson,
        email,
        phone,
        sponsorshipType,
        message,
        contribution,
      },
    });

    io.emit("newSponsor", sponsor);

    // Send confirmation emails
    await sendSponsorRegistrationEmail(sponsor);

    res.status(201).json(sponsor);
  } catch (error) {
    console.error("Error creating sponsor application:", error);
    res.status(500).json({ error: "Failed to create sponsor application" });
  }
};

export const getApprovedSponsors = async (_req: Request, res: Response) => {
  try {
    const sponsors = await prisma.sponsor.findMany({
      where: {
        status: "APPROVED",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(sponsors);
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    res.status(500).json({ error: "Failed to fetch sponsors" });
  }
};

export const getAllSponsors = async (req: Request, res: Response) => {
  try {
    const sponsors = await prisma.sponsor.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(sponsors);
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    res.status(500).json({ error: "Failed to fetch sponsors" });
  }
};
