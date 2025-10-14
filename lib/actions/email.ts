'use server';

import { Resend } from 'resend';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof formSchema>;

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL ?? 'onboarding@resend.dev';

export async function sendEmail(formData: ContactFormValues) {
  try {
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      return {
        error: 'Invalid form data',
        details: result.error.format(),
      };
    }

    const { name, email, subject, message } = formData;

    // Enhanced HTML email template with better styling
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Form Submission</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .email-container {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background-color: #4a6cf7;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
    }
    .email-body {
      padding: 20px;
      background-color: #ffffff;
    }
    .field {
      margin-bottom: 16px;
    }
    .field-label {
      font-weight: bold;
      color: #555;
      margin-bottom: 4px;
    }
    .field-value {
      background-color: #f5f5f5;
      padding: 10px;
      border-radius: 4px;
      border-left: 3px solid #4a6cf7;
    }
    .message-content {
      white-space: pre-line;
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      border-left: 3px solid #4a6cf7;
    }
    .email-footer {
      background-color: #f5f5f5;
      padding: 15px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>New Contact Request!</h1>
    </div>
    <div class="email-body">
      <div class="field">
        <div class="field-label">Name:</div>
        <div class="field-value">${name}</div>
      </div>
      
      <div class="field">
        <div class="field-label">Email:</div>
        <div class="field-value">
          <a href="mailto:${email}">${email}</a>
        </div>
      </div>
      
      <div class="field">
        <div class="field-label">Subject:</div>
        <div class="field-value">${subject}</div>
      </div>
      
      <div class="field">
        <div class="field-label">Message:</div>
        <div class="message-content">${message.replace(/\n/g, '<br/>')}</div>
      </div>
    </div>
    <div class="email-footer">
      This message was sent from your website contact form on ${new Date().toLocaleDateString()}
    </div>
  </div>
</body>
</html>
    `;

    // Plain text version as fallback
    const textContent = `
CONTACT FORM SUBMISSION

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Sent on: ${new Date().toLocaleDateString()}
    `;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [process.env.TO_EMAIL ?? 'ben.wang9000@example.com'],
      subject: `Contact Request: ${subject}`,
      replyTo: email,
      text: textContent,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend API error:', error);
      return {
        error: 'Failed to send email',
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Server error:', error);
    return {
      error: 'Internal server error',
    };
  }
}
