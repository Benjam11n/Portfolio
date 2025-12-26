export function generateContactEmailHtml(
  name: string,
  email: string,
  subject: string,
  message: string
) {
  return `
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
        <div class="message-content">${message.replace(/\n/g, "<br/>")}</div>
      </div>
    </div>
    <div class="email-footer">
      This message was sent from your website contact form on ${new Date().toLocaleDateString()}
    </div>
  </div>
</body>
</html>
  `;
}

export function generateContactEmailText(
  name: string,
  email: string,
  subject: string,
  message: string
) {
  return `
CONTACT FORM SUBMISSION

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Sent on: ${new Date().toLocaleDateString()}
  `;
}
