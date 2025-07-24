import { format } from 'date-fns';

// Event constants
const EVENT_CONFIG = {
  title: 'IBIEA 2025 Awards Ceremony',
  date: '2025-05-29',
  time: '16:00',
  location: 'Grand Hyatt, Muscat, Oman',
  duration: 6, // hours
  description: 'Join us for the prestigious IBIEA 2025 Awards Ceremony, where we celebrate excellence and innovation in business.',
  organizer: {
    name: 'IBIEA Team',
    email: process.env.EMAIL_USER || 'info@ibiea.com'
  }
};

// Generate calendar event data
export function generateCalendarEventData() {
  const startDate = new Date(`${EVENT_CONFIG.date}T${EVENT_CONFIG.time}:00`);
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + EVENT_CONFIG.duration);

  // Format dates for calendar
  const startDateStr = format(startDate, "yyyyMMdd'T'HHmmss");
  const endDateStr = format(endDate, "yyyyMMdd'T'HHmmss");

  return {
    title: EVENT_CONFIG.title,
    description: EVENT_CONFIG.description,
    location: EVENT_CONFIG.location,
    startTime: startDateStr,
    endTime: endDateStr,
    organizer: EVENT_CONFIG.organizer
  };
}

// Generate calendar button HTML
export function generateCalendarButtonHtml() {
  const eventData = generateCalendarEventData();
  
  // Create calendar URLs
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.title)}&dates=${eventData.startTime}/${eventData.endTime}&location=${encodeURIComponent(eventData.location)}&details=${encodeURIComponent(eventData.description)}&organizer=${encodeURIComponent(eventData.organizer.email)}`;
  
  const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(eventData.title)}&startdt=${eventData.startTime}&enddt=${eventData.endTime}&location=${encodeURIComponent(eventData.location)}&body=${encodeURIComponent(eventData.description)}&organizer=${encodeURIComponent(eventData.organizer.email)}`;
  
//   const icalData = `BEGIN:VCALENDAR
// VERSION:2.0
// PRODID:-//IBIEA//Calendar Event//EN
// BEGIN:VEVENT
// DTSTART:${eventData.startTime}
// DTEND:${eventData.endTime}
// SUMMARY:${eventData.title}
// DESCRIPTION:${eventData.description}
// LOCATION:${eventData.location}
// ORGANIZER;CN="${eventData.organizer.name}":mailto:${eventData.organizer.email}
// END:VEVENT
// END:VCALENDAR`;

  return `
    <div style="margin: 25px 0; text-align: center; background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
      <h3 style="color: #2b6cb0; margin: 0 0 15px 0; font-size: 18px;">Add Event to Your Calendar</h3>
      <div style="display: flex;width: 100%;justify-content: space-around">
        <a href="${googleCalendarUrl}" target="_blank" style="background-color: #4285F4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-flex; align-items: center; gap: 8px;margin: 0 12px;">
          Google Calendar
        </a>
        <a href="${outlookCalendarUrl}" target="_blank" style="background-color: #0078D4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-flex; align-items: center; gap: 8px;margin: 0 12px;">
          Outlook
        </a>
      </div>
      <p style="margin: 15px 0 0 0; color: #666; font-size: 14px;">Click any button above to add this event to your preferred calendar</p>
    </div>
  `;
}

// Generate event details HTML
export function generateEventDetailsHtml() {
  return `
    <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
      <h2 style="color: #2b6cb0; margin: 0 0 15px 0;">Event Details</h2>
      <div style="display: grid; gap: 10px;">
        <p style="margin: 0;"><strong>Event:</strong> ${EVENT_CONFIG.title}</p>
        <p style="margin: 0;"><strong>Date:</strong> May 29, 2025</p>
        <p style="margin: 0;"><strong>Time:</strong> 4:00 PM to 10:00 PM</p>
        <p style="margin: 0;"><strong>Location:</strong> ${EVENT_CONFIG.location}</p>
        <p style="margin: 0;"><strong>Duration:</strong> ${EVENT_CONFIG.duration} hours</p>
      </div>
    </div>
  `;
} 
