import { PrismaClient } from "@prisma/client";
import { transporter } from "../config/email";
import { dayBeforeReminderTemplate, sameDayReminderTemplate } from "../utils/reminderTemplates";

const prisma = new PrismaClient();
const EVENT_DATE = new Date('2025-05-29');

export async function sendDayBeforeReminders() {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Format dates to compare just the date part (YYYY-MM-DD)
    const tomorrowDateStr = tomorrow.toISOString().split('T')[0];
    const eventDateStr = EVENT_DATE.toISOString().split('T')[0];

    // Only proceed if tomorrow is the event date
    if (tomorrowDateStr !== eventDateStr) {
      console.log('Not sending day-before reminders - event is not tomorrow');
      return true;
    }

    // Get all RSVPs with ATTENDING status where the day before reminder hasn't been sent
    const rsvps = await prisma.rSVP.findMany({
      where: {
        status: "ATTENDING",
        dayBeforeReminderSent: false,
      },
      include: {
        nomination: true,
        participant: true,
        sponsor: true,
      }
    });

    for (const rsvp of rsvps) {
      // Determine the attendee data based on the type
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
        continue;
      }
      
      const reminderMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Reminder: IBIEA 2025 Event Tomorrow`,
        html: dayBeforeReminderTemplate(attendeeData)
      };

      await transporter.sendMail(reminderMailOptions);
      
      // Update that reminder was sent
      await prisma.rSVP.update({
        where: { id: rsvp.id },
        data: { dayBeforeReminderSent: true }
      });
      
      console.log(`Day-before reminder sent to ${email} for IBIEA 2025 event`);
    }
    
    return true;
  } catch (error: any) {
    console.error("Failed to send day-before reminders:", error);
    return false;
  }
}

export async function sendSameDayReminders() {
  try {
    // Get current date
    const now = new Date();
    
    // Format dates to compare just the date part (YYYY-MM-DD)
    const todayDateStr = now.toISOString().split('T')[0];
    const eventDateStr = EVENT_DATE.toISOString().split('T')[0];
    
    // Only proceed if today is the event date
    if (todayDateStr !== eventDateStr) {
      console.log('Not sending same-day reminders - event is not today');
      return true;
    }
    
    // Get all RSVPs with ATTENDING status where the same day reminder hasn't been sent
    const rsvps = await prisma.rSVP.findMany({
      where: {
        status: "ATTENDING",
        sameDayReminderSent: false,
      },
      include: {
        nomination: true,
        participant: true,
        sponsor: true,
      }
    });

    for (const rsvp of rsvps) {
      // Determine the attendee data based on the type
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
        continue;
      }
      
      const reminderMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Reminder: IBIEA 2025 Event Today`,
        html: sameDayReminderTemplate(attendeeData)
      };

      await transporter.sendMail(reminderMailOptions);
      
      // Update that reminder was sent
      await prisma.rSVP.update({
        where: { id: rsvp.id },
        data: { sameDayReminderSent: true }
      });
      
      console.log(`Same-day reminder sent to ${email} for IBIEA 2025 event`);
    }
    
    return true;
  } catch (error: any) {
    console.error("Failed to send same-day reminders:", error);
    return false;
  }
}