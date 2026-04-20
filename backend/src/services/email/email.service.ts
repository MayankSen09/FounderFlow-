import nodemailer from 'nodemailer';
import { emailConfig } from '../../config/email';
import logger from '../../utils/logger';

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(emailConfig);

export const EmailService = {
  // Verify connection configuration
  verifyConnection: async () => {
    try {
      await transporter.verify();
      logger.info('SMTP connection established successfully');
      return true;
    } catch (error) {
      logger.error('SMTP connection failed:', error);
      return false;
    }
  },

  // Base send function
  sendEmail: async (to: string, subject: string, html: string) => {
    try {
      const info = await transporter.sendMail({
        from: emailConfig.from,
        to,
        subject,
        html,
      });

      logger.info(`Email sent: ${info.messageId}`);

      // For Ethereal email (development), log the preview URL
      if (emailConfig.host.includes('ethereal.email')) {
        logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }

      return info;
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  },

  // Send notification to Admin about a new Demo Request
  sendDemoRequestNotification: async (demoRequest: any) => {
    const subject = `🚀 New Demo Request: ${demoRequest.company || demoRequest.name}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #4f46e5;">New Lead Received!</h2>
        <p>You have a new demo request from your website.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background-color: #f9fafb;">
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Name</td>
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${demoRequest.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Email</td>
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${demoRequest.email}</td>
          </tr>
          <tr style="background-color: #f9fafb;">
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Company</td>
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${demoRequest.company || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Role</td>
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${demoRequest.role || 'N/A'}</td>
          </tr>
          <tr style="background-color: #f9fafb;">
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Team Size</td>
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${demoRequest.teamSize || 'N/A'}</td>
          </tr>
        </table>

        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <strong>Message:</strong><br/>
          <p style="margin-top: 5px; font-style: italic;">"${demoRequest.message || 'No message provided'}"</p>
        </div>

        <div style="margin-top: 30px; text-align: center;">
          <a href="http://localhost:5173/admin/leads" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View in Dashboard</a>
        </div>
      </div>
    `;

    return EmailService.sendEmail(emailConfig.adminEmail, subject, html);
  },

  // Send confirmation to the User
  sendDemoConfirmation: async (demoRequest: any) => {
    const subject = `Confirmation: We've received your request!`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Hi ${demoRequest.name},</h2>
        <p>Thanks for your interest in FounderFlow AI!</p>
        <p>We've received your request for a demo. One of our strategy experts will review your details and get back to you within 24 hours to schedule a time that works best for you.</p>
        
        <p>In the meantime, feel free to check out our <a href="#">latest case studies</a>.</p>
        
        <br/>
        <p>Best regards,</p>
        <p><strong>The FounderFlow AI Team</strong></p>
      </div>
    `;

    return EmailService.sendEmail(demoRequest.email, subject, html);
  }
};
