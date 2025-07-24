import { sendDayBeforeReminders, sendSameDayReminders } from "./reminderServices";

const HOUR_IN_MS = 60 * 60 * 1000;

export function startReminderScheduler() {
  // Check once an hour for events that need reminders
  console.log("Starting reminder scheduler...");
  
  // Schedule day-before reminders (9 AM check)
  setInterval(async () => {
    const now = new Date();
    if (now.getHours() === 9) {
      console.log("Running scheduled day-before reminder check...");
      await sendDayBeforeReminders();
    }
  }, HOUR_IN_MS);
  
  // Schedule same-day reminders (7 AM check)
  setInterval(async () => {
    const now = new Date();
    if (now.getHours() === 7) {
      console.log("Running scheduled same-day reminder check...");
      await sendSameDayReminders();
    }
  }, HOUR_IN_MS);
}