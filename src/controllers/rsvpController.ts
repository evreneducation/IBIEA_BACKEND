import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { transporter } from "../config/email";
import { rsvpConfirmationTemplate } from "../utils/reminderTemplates";

const prisma = new PrismaClient();

export const createRSVP = async (req: Request, res: Response) => {
  try {
    const {
      attendeeType,
      attendeeId,
      status,
    } = req.body;

    if (!['NOMINATION', 'PARTICIPANT', 'SPONSOR'].includes(attendeeType)) {
      return res.status(400).json({ error: "Invalid attendee type" });
    }

    // Prepare data based on attendee type
    let attendeeData;
    let rsvpData: any = {
      status,
      attendeeType,
    };

    if (attendeeType === 'NOMINATION') {
      const nomination = await prisma.nomination.findUnique({
        where: { id: Number(attendeeId) }
      });

      if (!nomination) {
        return res.status(404).json({ error: "Nomination not found" });
      }

      attendeeData = nomination;
      rsvpData.nominationId = Number(attendeeId);
    } else if (attendeeType === 'PARTICIPANT') {
      const participant = await prisma.participant.findUnique({
        where: { id: Number(attendeeId) }
      });

      if (!participant) {
        return res.status(404).json({ error: "Participant not found" });
      }

      attendeeData = participant;
      rsvpData.participantId = Number(attendeeId);
    } else if (attendeeType === 'SPONSOR') {
      const sponsor = await prisma.sponsor.findUnique({
        where: { id: Number(attendeeId) }
      });

      if (!sponsor) {
        return res.status(404).json({ error: "Sponsor not found" });
      }

      attendeeData = sponsor;
      rsvpData.sponsorId = Number(attendeeId);
    }

    // Check if RSVP already exists
    let existingRSVP;
    
    if (attendeeType === 'NOMINATION') {
      existingRSVP = await prisma.rSVP.findFirst({
        where: { nominationId: Number(attendeeId) }
      });
    } else if (attendeeType === 'PARTICIPANT') {
      existingRSVP = await prisma.rSVP.findFirst({
        where: { participantId: Number(attendeeId) }
      });
    } else if (attendeeType === 'SPONSOR') {
      existingRSVP = await prisma.rSVP.findFirst({
        where: { sponsorId: Number(attendeeId) }
      });
    }

    let rsvp;
    
    if (existingRSVP) {
      // Update existing RSVP
      rsvp = await prisma.rSVP.update({
        where: { id: existingRSVP.id },
        data: { status }
      });
    } else {
      // Create new RSVP
      rsvp = await prisma.rSVP.create({
        data: rsvpData
      });
    }

    // Send confirmation email
    const email = attendeeType === 'NOMINATION' ? attendeeData?.email : 
                  attendeeType === 'PARTICIPANT' ? attendeeData?.email : 
                  attendeeData?.email;
    
    const rsvpMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "IBIEA 2025 | RSVP Confirmation",
      html: rsvpConfirmationTemplate(attendeeData, status)
    };

    await transporter.sendMail(rsvpMailOptions);

    res.status(201).json(rsvp);
  } catch (error) {
    console.error("Error creating/updating RSVP:", error);
    res.status(500).json({ error: "Failed to create/update RSVP" });
  }
};

export const updateRSVP = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const rsvp = await prisma.rSVP.update({
      where: { id: Number(id) },
      data: { status },
      include: {
        nomination: true,
        participant: true,
        sponsor: true,
      }
    });

    // Determine attendee data based on the type
    let attendeeData;
    let email;
    
    if (rsvp.attendeeType === 'NOMINATION' && rsvp.nomination) {
      attendeeData = rsvp.nomination;
      email = rsvp.nomination.email;
    } else if (rsvp.attendeeType === 'PARTICIPANT' && rsvp.participant) {
      attendeeData = rsvp.participant;
      email = rsvp.participant.email;
    } else if (rsvp.attendeeType === 'SPONSOR' && rsvp.sponsor) {
      attendeeData = rsvp.sponsor;
      email = rsvp.sponsor.email;
    } else {
      console.error(`Invalid RSVP data for id ${rsvp.id}`);
      return res.status(400).json({ error: "Invalid RSVP data" });
    }

    // Send confirmation email
    const rsvpMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "IBIEA 2025 | RSVP Update Confirmation",
      html: rsvpConfirmationTemplate(attendeeData, status)
    };

    await transporter.sendMail(rsvpMailOptions);

    res.json(rsvp);
  } catch (error) {
    console.error("Error updating RSVP:", error);
    res.status(500).json({ error: "Failed to update RSVP" });
  }
};

export const getAllRSVPs = async (_req: Request, res: Response) => {
  try {
    const rsvps = await prisma.rSVP.findMany({
      include: {
        nomination: true,
        participant: true,
        sponsor: true,
      }
    });

    res.json(rsvps);
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    res.status(500).json({ error: "Failed to fetch RSVPs" });
  }
};

export const getRSVPsByStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.params;
    
    const rsvps = await prisma.rSVP.findMany({
      where: { status },
      include: {
        nomination: true,
        participant: true,
        sponsor: true,
      }
    });

    res.json(rsvps);
  } catch (error) {
    console.error("Error fetching RSVPs by status:", error);
    res.status(500).json({ error: "Failed to fetch RSVPs" });
  }
};

export const deleteRSVP = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.rSVP.delete({
      where: { id: Number(id) }
    });

    res.json({ message: "RSVP deleted successfully" });
  } catch (error) {
    console.error("Error deleting RSVP:", error);
    res.status(500).json({ error: "Failed to delete RSVP" });
  }
};