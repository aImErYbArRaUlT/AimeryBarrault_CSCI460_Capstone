import nodemailer from "nodemailer";
import type SMTPConnection from "nodemailer/lib/smtp-connection";

// Remove any surrounding quotes from environment variables
const cleanEnvValue = (value?: string) => {
  if (!value) return undefined;
  return value.replace(/^(['"])(.*)\1$/, '$2');
};

// Create the transporter with SMTP config
const transporter = nodemailer.createTransport({
  host: cleanEnvValue(process.env.SMTP_HOST),
  port: parseInt(cleanEnvValue(process.env.SMTP_PORT) || '465'),
  secure: true,
  auth: {
    user: cleanEnvValue(process.env.SMTP_USER),
    pass: cleanEnvValue(process.env.SMTP_PASSWORD),
  },
  debug: false
} as nodemailer.TransportOptions);

// Interface for contact form data
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
}

/**
 * Sends a contact form email to the site administrators
 * @param formData Contact form data submitted by user
 * @returns Promise with messageId if successful
 */
export async function sendContactEmail(formData: ContactFormData) {
  const { name, email, subject, message, phone, company } = formData;
  
  // Email recipient should be your company email
  const recipients = process.env.CONTACT_EMAIL_RECIPIENTS || process.env.EMAIL_FROM || process.env.SMTP_USER || '';
  
  if (!recipients) {
    throw new Error("Contact form recipient email not configured");
  }
  
  // Format the email
  const phoneInfo = phone ? `<p><strong>Phone:</strong> ${phone}</p>` : '';
  const companyInfo = company ? `<p><strong>Company:</strong> ${company}</p>` : '';
  
  const mailOptions = {
    from: cleanEnvValue(process.env.EMAIL_FROM) || cleanEnvValue(process.env.SMTP_USER) || 'no-reply@yourcompany.com',
    to: recipients,
    replyTo: email,
    subject: `Contact Form: ${subject}`,
    text: `
Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}\n` : ''}
${company ? `Company: ${company}\n` : ''}
Message:
${message}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
          <h2 style="color: #2c3e50; margin-bottom: 20px;">New Contact Form Submission</h2>
          
          <div style="margin-bottom: 20px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phoneInfo}
            ${companyInfo}
          </div>
          
          <div style="border-top: 1px solid #e9ecef; padding-top: 20px;">
            <h3 style="color: #2c3e50; margin-bottom: 10px;">Message:</h3>
            <p style="white-space: pre-line;">${message}</p>
          </div>
        </div>
        
        <div style="text-align: center; color: #7f8c8d; font-size: 12px; margin-top: 20px;">
          <p>This email was sent from the contact form on your website.</p>
        </div>
      </div>
    `,
  };

  try {
    try {
      // First attempt with default settings
      const info = await transporter.sendMail(mailOptions);
      return info.messageId;
    } catch (smtpError: any) {
      // If we get an authentication error, try with a different auth method
      if (smtpError.code === 'EAUTH') {
        // Create a new transporter with LOGIN auth method
        const loginTransporter = nodemailer.createTransport({
          host: cleanEnvValue(process.env.SMTP_HOST),
          port: 465,
          secure: true,
          auth: {
            user: cleanEnvValue(process.env.SMTP_USER),
            pass: cleanEnvValue(process.env.SMTP_PASSWORD),
            method: 'LOGIN'
          },
          tls: { rejectUnauthorized: false },
          debug: false
        } as nodemailer.TransportOptions);
        
        // Try again with LOGIN auth method
        const info = await loginTransporter.sendMail(mailOptions);
        return info.messageId;
      }
      
      // If that fails, try PLAIN auth method
      if (smtpError.code === 'EAUTH') {
        // Create a new transporter with PLAIN auth method
        const plainTransporter = nodemailer.createTransport({
          host: cleanEnvValue(process.env.SMTP_HOST),
          port: 465,
          secure: true,
          auth: {
            user: cleanEnvValue(process.env.SMTP_USER),
            pass: cleanEnvValue(process.env.SMTP_PASSWORD),
            method: 'PLAIN'
          },
          tls: { rejectUnauthorized: false },
          debug: false
        } as nodemailer.TransportOptions);
        
        // Try sending with PLAIN auth
        const info = await plainTransporter.sendMail(mailOptions);
        return info.messageId;
      }
      
      // If it's some other error, rethrow it
      throw smtpError;
    }
  } catch (error: any) {
    // Provide a more helpful error message
    if (error.code === 'EAUTH') {
      throw new Error(`Authentication failed. Please check SMTP_USER and SMTP_PASSWORD values.`);
    } else {
      throw error;
    }
  }
}