import { PrismaClient } from "@prisma/client";
import { transporter } from "../config/email";
import { generateCalendarButtonHtml, generateEventDetailsHtml } from "../utils/calendarUtils";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

// Email template for calendar invites
const calendarEmailTemplate = (recipientData: any) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${process.env.BASE_URL}/assets/email-assets/emailBanner.jpg" alt="IBIEA 2025 Banner" style="max-width: 100%; height: auto;"/>
    </div>
    <h1 style="color: #1a365d; margin-bottom: 20px;">IBIEA 2025 Awards Ceremony Invitation</h1>
    <p style="font-size: 16px; line-height: 1.5;">Dear ${recipientData.fullName},</p>
    
    <p style="font-size: 16px; line-height: 1.5;">We are excited to have you as a part of IBIEA 2025 Indo-Gulf chapter.</p>
    <p style="font-size: 16px; line-height: 1.5;">Please add this event to your calendar using one of the options below. We look forward to seeing you there!</p>
    
    ${generateEventDetailsHtml()}
    ${generateCalendarButtonHtml()}
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0;">Best regards,</p>
      <p style="margin: 5px 0;">Team Traveon</p>
      <p style="margin: 5px 0;">+91-9999274266, +968 95143144</p>
      <p style="margin: 5px 0;"><a href="https://ibiea.com/" style="color: #2b6cb0; text-decoration: none;">https://ibiea.com/</a></p>
    </div>
  </div>
`;

// Function to send calendar email to a single recipient
async function sendCalendarEmail(recipient: any) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient.email,
      subject: "IBIEA 2025 Awards Ceremony | Calendar Invitation",
      html: calendarEmailTemplate(recipient)
    };

    await transporter.sendMail(mailOptions);
    console.log(`Calendar email sent successfully to: ${recipient.email}`);
    return true;
  } catch (error) {
    console.error(`Failed to send calendar email to ${recipient.email}:`, error);
    return false;
  }
}

// Function to send calendar emails to all nominees
async function sendCalendarEmailsToNominees() {
  try {
    console.log("Starting to send calendar emails to nominees...");
    
    // Fetch all nominees from database
    const nominees = await prisma.nomination.findMany();

    if (nominees.length === 0) {
      console.log("No nominees found in the database");
      return;
    }

    console.log(`Found ${nominees.length} nominees. Sending calendar emails...`);

    // Send emails with delay to avoid rate limiting
    const results = await Promise.allSettled(
      nominees.map(async (nominee, index) => {
        // Add delay between emails (500ms)
        await new Promise(resolve => setTimeout(resolve, index * 500));
        return sendCalendarEmail(nominee);
      })
    );

    // Process results
    const successful = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
    const failed = results.filter(r => r.status === 'rejected' || r.value === false).length;

    console.log("\nResults:");
    console.log(`Total emails attempted: ${nominees.length}`);
    console.log(`Successful: ${successful}`);
    console.log(`Failed: ${failed}`);

    // Log failed emails
    results.forEach((result, index) => {
      if (result.status === 'rejected' || result.value === false) {
        console.log(`Failed to send to: ${nominees[index].email}`);
      }
    });

  } catch (error) {
    console.error("Error in sending calendar emails to nominees:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Function to send calendar emails to all participants
async function sendCalendarEmailsToParticipants() {
  try {
    console.log("Starting to send calendar emails to participants...");
    
    // Fetch all participants from database
    const participants = await prisma.participant.findMany();

    if (participants.length === 0) {
      console.log("No participants found in the database");
      return;
    }

    console.log(`Found ${participants.length} participants. Sending calendar emails...`);

    // Send emails with delay to avoid rate limiting
    const results = await Promise.allSettled(
      participants.map(async (participant, index) => {
        // Add delay between emails (500ms)
        await new Promise(resolve => setTimeout(resolve, index * 500));
        return sendCalendarEmail(participant);
      })
    );

    // Process results
    const successful = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
    const failed = results.filter(r => r.status === 'rejected' || r.value === false).length;

    console.log("\nResults:");
    console.log(`Total emails attempted: ${participants.length}`);
    console.log(`Successful: ${successful}`);
    console.log(`Failed: ${failed}`);

    // Log failed emails
    results.forEach((result, index) => {
      if (result.status === 'rejected' || result.value === false) {
        console.log(`Failed to send to: ${participants[index].email}`);
      }
    });

  } catch (error) {
    console.error("Error in sending calendar emails to participants:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Function to send calendar emails to a custom list of recipients
async function sendCalendarEmailsToCustomList(recipients: any[]) {
  try {
    console.log(`Starting to send calendar emails to ${recipients.length} custom recipients...`);

    if (recipients.length === 0) {
      console.log("No recipients provided");
      return;
    }

    // Send emails with delay to avoid rate limiting
    const results = await Promise.allSettled(
      recipients.map(async (recipient, index) => {
        // Add delay between emails (500ms)
        await new Promise(resolve => setTimeout(resolve, index * 500));
        return sendCalendarEmail(recipient);
      })
    );

    // Process results
    const successful = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
    const failed = results.filter(r => r.status === 'rejected' || r.value === false).length;

    console.log("\nResults:");
    console.log(`Total emails attempted: ${recipients.length}`);
    console.log(`Successful: ${successful}`);
    console.log(`Failed: ${failed}`);

    // Log failed emails
    results.forEach((result, index) => {
      if (result.status === 'rejected' || result.value === false) {
        console.log(`Failed to send to: ${recipients[index].email}`);
      }
    });

  } catch (error) {
    console.error("Error in sending calendar emails to custom list:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export {
  sendCalendarEmail,
  sendCalendarEmailsToNominees,
  sendCalendarEmailsToParticipants,
  sendCalendarEmailsToCustomList
}; 