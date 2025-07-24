import { transporter } from "../config/email";
import { nominationAdminNotificationTemplate, nominationConfirmationTemplate, sponsorAdminNotificationTemplate, sponsorConfirmationTemplate, participantAdminNotificationTemplate, participantConfirmationTemplate } from "../utils/emailTemplates";
import path from 'path';

const getBrochureAttachment = () => ({
  filename: 'IBIEA2025_Brochure.pdf',
  path: path.join(process.cwd(), 'public/assets/email-assets/IBIEA_2025_BROCHURE.pdf'),
  contentType: 'application/pdf'
});

const getSponsorBrochureAttachment = () => ({
  filename: 'IBIEA2025_Brochure.pdf',
  path: path.join(process.cwd(), 'public/assets/email-assets/IBIEA_2025_SPONSOR_BROCHURE.pdf'),
  contentType: 'application/pdf'
});

const getParticipationBrochureAttachment = () => ({
  filename: 'IBIEA2025_Brochure.pdf',
  path: path.join(process.cwd(), 'public/assets/email-assets/IBIEA_2025_PARTICIPATION_BROCHURE.pdf'),
  contentType: 'application/pdf'
});

export async function sendNominationRegistrationEmail(nominationData: any) {

  const nominationMailOptions = {
    from: process.env.EMAIL_USER,
    to: nominationData.email,
    subject: "IBIEA 2025 | Nomination Submission Confirmation",
    html: nominationConfirmationTemplate(nominationData),
    attachments: [getBrochureAttachment()]
  };

  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New Nomination Registration: ${nominationData.fullName}`,
    html: nominationAdminNotificationTemplate(nominationData),
    attachments: [getBrochureAttachment()]
  };

  try {
    await Promise.all([
      transporter.sendMail(nominationMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    console.log(
      `Nomination registration email sent successfully for ${nominationData.email}`
    );
    return true;
  } catch (error: any) {
    console.error("nomination email service error:", {
      error: error.message,
      nomination: nominationData.email,
      timestamp: new Date().toISOString(),
    });
    // Don't throw error, just log it - we don't want to fail registration if email fails
    return false;
  }
}

export async function sendSponsorRegistrationEmail(sponsorData: any) {
  const sponsorMailOptions = {
    from: process.env.EMAIL_USER,
    to: sponsorData.email,
    subject: "IBIEA 2025 | Sponsorship Application Confirmation",
    html: sponsorConfirmationTemplate(sponsorData),
    attachments: [getSponsorBrochureAttachment()]
  };

  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New Sponsorship Application: ${sponsorData.companyName}`,
    html: sponsorAdminNotificationTemplate(sponsorData),
    attachments: [getSponsorBrochureAttachment()]
  };

  try {
    await Promise.all([
      transporter.sendMail(sponsorMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    console.log(
      `Sponsorship registration email sent successfully for ${sponsorData.email}`
    );
    return true;
  } catch (error: any) {
    console.error("sponsorship email service error:", {
      error: error.message,
      sponsor: sponsorData.email,
      timestamp: new Date().toISOString(),
    });
    return false;
  }
}

export async function sendParticipantRegistrationEmail(participantData: any, pdfBuffer: Buffer) {
  const participantMailOptions = {
    from: process.env.EMAIL_USER,
    to: participantData.email,
    subject: "IBIEA 2025 | Participation Application Confirmation",
    html: participantConfirmationTemplate(participantData),
    attachments: [
      {
        filename: `IBIEA2025_Participant_${participantData.verificationCode}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      },
      getParticipationBrochureAttachment()
    ]
  };

  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New Participation Application: ${participantData.fullName}`,
    html: participantAdminNotificationTemplate(participantData),
    attachments: [
      {
        filename: `IBIEA2025_Participant_${participantData.verificationCode}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      },
      getParticipationBrochureAttachment()
    ]
  };

  try {
    await Promise.all([
      transporter.sendMail(participantMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    console.log(
      `Participation registration email sent successfully for ${participantData.email}`
    );
    return true;
  } catch (error: any) {
    console.error("participation email service error:", {
      error: error.message,
      participant: participantData.email,
      timestamp: new Date().toISOString(),
    });
    return false;
  }
}
