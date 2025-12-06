import * as brevo from '@getbrevo/brevo';
import { config } from 'dotenv';

config();

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

export type SendEmailAttachment = {
  filename: string;
  content: string;
  contentType?: string;
};

export type SendEmailInput = {
  fromName?: string;
  from?: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: SendEmailAttachment[];
};

export async function sendEmail(emailData: SendEmailInput) {
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.sender = {
    name: emailData.fromName || 'IBIEA 2025',
    email: emailData.from || process.env.BREVO_FROM_EMAIL!,
  };

  sendSmtpEmail.to = Array.isArray(emailData.to)
    ? emailData.to.map((email) => ({ email }))
    : [{ email: emailData.to }];

  sendSmtpEmail.subject = emailData.subject;

  if (emailData.html) sendSmtpEmail.htmlContent = emailData.html;
  if (emailData.text) sendSmtpEmail.textContent = emailData.text;

  if (emailData.attachments?.length) {
    sendSmtpEmail.attachment = emailData.attachments.map((att) => ({
      name: att.filename,
      content: att.content, // Base64 string
      type: att.contentType || 'application/octet-stream',
    }));
  }

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return result;
  } catch (error: any) {
    console.error('Brevo API error:', error?.message || error);
    throw new Error(`Failed to send email: ${error?.message || 'Unknown error'}`);
  }
}

// Verify connection on startup (non-fatal)
(async () => {
  try {
    console.log('Brevo API configured successfully');
  } catch (error: any) {
    console.error('Brevo API configuration error:', error?.message);
  }
})();