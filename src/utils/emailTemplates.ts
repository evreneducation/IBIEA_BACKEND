export const nominationConfirmationTemplate = (nominationData: any) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${process.env.BASE_URL}/assets/email-assets/emailBanner.jpg" alt="IBIEA 2025 Banner" style="max-width: 100%; height: auto;"/>
    </div>
    <h1>Welcome to IBIEA 2025, ${nominationData.fullName}!</h1>
    <p>Thank you for submitting your nominations for IBIEA 2025.</p>
    
    <h2>Your Submission Details:</h2>
    <ul>
      <li>Designation: ${nominationData.designation}</li>
      <li>Category: ${nominationData.category}</li>
      <li>Organization: ${nominationData.organization}</li>
      <li>Industry: ${nominationData.industry}</li>
    </ul>

    <h2>Important Dates:</h2>
    <ul>
      <li>Announcement of Finalists: 25 April 2025</li>
      <li>Awards Ceremony: 29 May 2025</li>
    </ul>

    <p>Next Steps:</p>
    <ol>
      <li>Our team will review your submission</li>
      <li>You will receive a notification about the status of your nomination</li>
    </ol>

    <p>If you have any questions, please don't hesitate to contact us at info@IBIEA.com</p>
    
    <br/>
    <p>Best regards,</p>
    <p>IBIEA Team</p>
    <p>+91-9540111207, +968 95143144</p>
    <p>https://ibiea.com/</p>
  </div>
`;

export const nominationAdminNotificationTemplate = (nominationData: any) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${process.env.BASE_URL}/assets/email-assets/emailBanner.jpg" alt="IBIEA 2025 Banner" style="max-width: 100%; height: auto;"/>
    </div>
    <h1>New Nomination Submission</h1>
    <p>A new nomination has been submitted for IBIEA 2025.</p>
    
    <h2>Nomination Details:</h2>
    <ul>
      <li><strong>Name:</strong> ${nominationData.fullName}</li>
      <li><strong>Email:</strong> ${nominationData.email}</li>
      <li><strong>Phone:</strong> ${nominationData.phone}</li>
      <li><strong>Category:</strong> ${nominationData.category}</li>
      <li><strong>Organization:</strong> ${nominationData.organization}</li>
    </ul>

    <p>Please review the submission and follow up with the nomination if needed.</p>
    
    <br/>
    <p>Best regards,</p>
    <p>IBIEA System</p>
  </div>
`;

export const sponsorConfirmationTemplate = (sponsorData: any) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${process.env.BASE_URL}/assets/email-assets/emailBanner.jpg" alt="IBIEA 2025 Banner" style="max-width: 100%; height: auto;"/>
    </div>
    <h1>Thank you for your interest in sponsoring IBIEA 2025!</h1>
    <p>Dear ${sponsorData.contactPerson},</p>
    
    <p>We have received your sponsorship application for IBIEA 2025. Thank you for your interest in partnering with us.</p>
    
    <h2>Your Application Details:</h2>
    <ul>
      <li>Company Name: ${sponsorData.companyName}</li>
      <li>Sponsorship Type: ${sponsorData.sponsorshipType}</li>
      <li>Contact Person: ${sponsorData.contactPerson}</li>
      <li>Email: ${sponsorData.email}</li>
    </ul>

    <p>Next Steps:</p>
    <ol>
      <li>Our team will review your application</li>
      <li>We will contact you within 2-3 business days to discuss the next steps</li>
      <li>Upon approval, we will send you the sponsorship agreement and payment details</li>
    </ol>

    <p>If you have any questions, please don't hesitate to contact us at info@IBIEA.com</p>
    
    <br/>
    <p>Best regards,</p>
    <p>IBIEA Team</p>
    <p>+91-9540111207, +968 95143144</p>
    <p>https://ibiea.com/</p>
  </div>
`;

export const sponsorAdminNotificationTemplate = (sponsorData: any) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${process.env.BASE_URL}/assets/email-assets/emailBanner.jpg" alt="IBIEA 2025 Banner" style="max-width: 100%; height: auto;"/>
    </div>
    <h1>New Sponsorship Application</h1>
    <p>A new sponsorship application has been submitted for IBIEA 2025.</p>
    
    <h2>Sponsor Details:</h2>
    <ul>
      <li><strong>Company Name:</strong> ${sponsorData.companyName}</li>
      <li><strong>Sponsorship Type:</strong> ${sponsorData.sponsorshipType}</li>
      <li><strong>Contact Person:</strong> ${sponsorData.contactPerson}</li>
      <li><strong>Email:</strong> ${sponsorData.email}</li>
      <li><strong>Phone:</strong> ${sponsorData.phone}</li>
    </ul>

    <p>Please review the application and follow up with the sponsor.</p>
    
    <br/>
    <p>Best regards,</p>
    <p>IBIEA System</p>
  </div>
`;

export const participantConfirmationTemplate = (participantData: any) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${process.env.BASE_URL}/assets/email-assets/emailBanner.jpg" alt="IBIEA 2025 Banner" style="max-width: 100%; height: auto;"/>
    </div>
    <h1>Thank you for applying to participate in IBIEA 2025!</h1>
    <p>Dear ${participantData.fullName},</p>
    
    <p>We have received your participation application for IBIEA 2025. Thank you for your interest in being part of this prestigious event.</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center;">
      <h2 style="color: #2b6cb0; margin: 0;">Your Verification Code</h2>
      <p style="font-size: 24px; font-weight: bold; margin: 10px 0; color: #1a365d;">${participantData.verificationCode}</p>
      <p style="margin: 0; color: #4a5568;">Please keep this code safe. You will need it during event check-in.</p>
    </div>

    <h2>Your Application Details:</h2>
    <ul>
      <li>Full Name: ${participantData.fullName}</li>
      <li>Organization: ${participantData.organization}</li>
      <li>Designation: ${participantData.designation}</li>
      <li>Category: ${participantData.category}</li>
      <li>Email: ${participantData.email}</li>
    </ul>

    <p>Important Information:</p>
    <ul>
      <li>Please find attached your participant information document with verification code</li>
      <li>Keep this document safe and bring it to the event</li>
      <li>The verification code is unique to you and cannot be transferred</li>
    </ul>

    <p>If you have any questions, please don't hesitate to contact us at info@IBIEA.com or call us at +91-9540111207</p>
    
    <br/>
    <p>Best regards,</p>
    <p>IBIEA Team</p>
    <p>+91-9540111207, +968 95143144</p>
    <p>https://ibiea.com/</p>
  </div>
`;

export const participantAdminNotificationTemplate = (participantData: any) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${process.env.BASE_URL}/assets/email-assets/emailBanner.jpg" alt="IBIEA 2025 Banner" style="max-width: 100%; height: auto;"/>
    </div>
    <h1>New Participation Application</h1>
    <p>A new participation application has been submitted for IBIEA 2025.</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
      <h2 style="color: #2b6cb0; margin: 0;">Verification Code</h2>
      <p style="font-size: 24px; font-weight: bold; margin: 10px 0; color: #1a365d;">${participantData.verificationCode}</p>
    </div>

    <h2>Participant Details:</h2>
    <ul>
      <li><strong>Full Name:</strong> ${participantData.fullName}</li>
      <li><strong>Organization:</strong> ${participantData.organization}</li>
      <li><strong>Designation:</strong> ${participantData.designation}</li>
      <li><strong>Category:</strong> ${participantData.category}</li>
      <li><strong>Email:</strong> ${participantData.email}</li>
      <li><strong>Phone:</strong> ${participantData.phone}</li>
    </ul>

    <p>Please review the application and follow up with the participant.</p>
    
    <br/>
    <p>Best regards,</p>
    <p>IBIEA System</p>
  </div>
`;