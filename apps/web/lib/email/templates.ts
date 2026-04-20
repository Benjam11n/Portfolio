const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const formatSubmissionDate = () =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date());

const renderMessageHtml = (message: string) =>
  escapeHtml(message).replaceAll("\n", "<br />");

export const generateContactEmailHtml = (
  name: string,
  email: string,
  message: string
) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = renderMessageHtml(message);
  const sentOn = formatSubmissionDate();

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New contact form submission</title>
  </head>
  <body style="margin:0;background-color:#ffffff;color:#111111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <div style="margin:0 auto;max-width:640px;padding:32px 20px;">
      <div style="border:1px solid #e5e7eb;background-color:#ffffff;">
        <div style="border-bottom:1px solid #e5e7eb;padding:24px 24px 20px;">
          <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">
            Portfolio Contact
          </p>
          <h1 style="margin:0;font-size:24px;line-height:1.2;font-weight:600;color:#111111;">
            New message received
          </h1>
        </div>

        <div style="padding:24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
            <tr>
              <td style="padding:0 0 20px;">
                <p style="margin:0 0 6px;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#6b7280;">
                  Name
                </p>
                <p style="margin:0;font-size:15px;line-height:1.6;color:#111111;">
                  ${safeName}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 20px;">
                <p style="margin:0 0 6px;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#6b7280;">
                  Email
                </p>
                <a href="mailto:${safeEmail}" style="font-size:15px;line-height:1.6;color:#111111;text-decoration:underline;">
                  ${safeEmail}
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:0;">
                <p style="margin:0 0 6px;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#6b7280;">
                  Message
                </p>
                <div style="border:1px solid #e5e7eb;background-color:#fafafa;padding:16px;font-size:15px;line-height:1.7;color:#111111;">
                  ${safeMessage}
                </div>
              </td>
            </tr>
          </table>
        </div>

        <div style="border-top:1px solid #e5e7eb;padding:16px 24px;font-size:12px;line-height:1.6;color:#6b7280;">
          Sent from your portfolio contact form on ${sentOn}
        </div>
      </div>
    </div>
  </body>
</html>`;
};

export const generateContactEmailText = (
  name: string,
  email: string,
  message: string
) => {
  const sentOn = formatSubmissionDate();

  return [
    "NEW MESSAGE RECEIVED",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    "Message:",
    message,
    "",
    `Sent from your portfolio contact form on ${sentOn}`,
  ].join("\n");
};
