const EVENT_DATE = '2025-05-29';
const EVENT_TIME = '14:00';
const EVENT_LOCATION = 'Grand Hyatt, Muscat, Oman';

export const dayBeforeReminderTemplate = (attendeeData: any) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${process.env.BASE_URL}/assets/email-assets/emailBanner.jpg" alt="IBIEA 2025 Banner" style="max-width: 100%; height: auto;"/>
    </div>
    <h1 style="color: #1a365d; margin-bottom: 20px;">Your Event is Tomorrow, ${attendeeData.fullName || attendeeData.contactPerson}!</h1>
    <p style="font-size: 16px; line-height: 1.5;">This is a friendly reminder that the IBIEA 2025 event you registered for is happening tomorrow.</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
      <h2 style="color: #2b6cb0; margin: 0;">Event Details</h2>
      <p><strong>Event:</strong> IBIEA 2025 Awards Ceremony</p>
      <p><strong>Date:</strong> May 29, 2025</p>
      <p><strong>Time:</strong> 2:00 PM</p>
      <p><strong>Location:</strong> ${EVENT_LOCATION}</p>
      ${attendeeData.verificationCode ? `<p><strong>Your Verification Code:</strong> ${attendeeData.verificationCode}</p>` : ''}
    </div>

    <p>Please remember to bring your verification code with you for check-in.</p>
    <p>We look forward to seeing you tomorrow!</p>
    
    <br/>
    <p>Best regards,</p>
    <p>IBIEA Team</p>
    <p>+91-9540111207, +968 95143144</p>
    <p>https://ibiea.com/</p>
  </div>
`;

export const sameDayReminderTemplate = (attendeeData: any) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${process.env.BASE_URL}/assets/email-assets/emailBanner.jpg" alt="IBIEA 2025 Banner" style="max-width: 100%; height: auto;"/>
    </div>
    <h1>Your Event is Today, ${attendeeData.fullName || attendeeData.contactPerson}!</h1>
    <p>This is a friendly reminder that the IBIEA 2025 event you registered for is happening today.</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
      <h2 style="color: #2b6cb0; margin: 0;">Event Details</h2>
      <p><strong>Event:</strong> IBIEA 2025 Awards Ceremony</p>
      <p><strong>Date:</strong> May 29, 2025</p>
      <p><strong>Time:</strong> 2:00 PM</p>
      <p><strong>Location:</strong> ${EVENT_LOCATION}</p>
      ${attendeeData.verificationCode ? `<p><strong>Your Verification Code:</strong> ${attendeeData.verificationCode}</p>` : ''}
    </div>

    <p>Please remember to bring your verification code with you for check-in.</p>
    <p>We look forward to seeing you today!</p>
    
    <br/>
    <p>Best regards,</p>
    <p>IBIEA Team</p>
    <p>+91-9540111207, +968 95143144</p>
    <p>https://ibiea.com/</p>
  </div>
`;

export const rsvpConfirmationTemplate = (attendeeData: any, rsvpStatus: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${process.env.BASE_URL}/assets/email-assets/emailBanner.jpg" alt="IBIEA 2025 Banner" style="max-width: 100%; height: auto;"/>
    </div>
    <h1>RSVP Confirmation</h1>
    <p>Dear ${attendeeData.fullName || attendeeData.contactPerson},</p>
    
    <p>Thank you for your RSVP response. We have recorded your status as: <strong>${rsvpStatus}</strong>.</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
      <h2 style="color: #2b6cb0; margin: 0;">Event Details</h2>
      <p><strong>Event:</strong> IBIEA 2025 Awards Ceremony</p>
      <p><strong>Date:</strong> May 29, 2025</p>
      <p><strong>Time:</strong> 2:00 PM</p>
      <p><strong>Location:</strong> ${EVENT_LOCATION}</p>
      ${attendeeData.verificationCode ? `<p><strong>Your Verification Code:</strong> ${attendeeData.verificationCode}</p>` : ''}
    </div>

    ${rsvpStatus === 'ATTENDING' ? `
    <p>Please remember to bring your verification code with you for check-in.</p>
    <p>We look forward to seeing you at the event!</p>
    ` : rsvpStatus === 'MAYBE' ? `
    <p>If your plans change and you decide to attend, please update your RSVP on our website.</p>
    <p>We hope you can make it to the event!</p>
    ` : `
    <p>We're sorry to hear you won't be able to join us. If your plans change, please update your RSVP on our website.</p>
    `}
    
    <br/>
    <p>Best regards,</p>
    <p>IBIEA Team</p>
    <p>+91-9540111207, +968 95143144</p>
    <p>https://ibiea.com/</p>
  </div>
`;