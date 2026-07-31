import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "C Link Logistics <tracking@clinkshipping.com>";

export type ShipmentEmailData = {
  tracking_number: string;
  origin: string;
  destination: string;
  mode: string;
  status: string;
  current_location: string | null;
  eta: string | null;
  customer_email: string;
  baseUrl: string;
};

function prettyStatus(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function buildTrackingLink(baseUrl: string, trackingNumber: string) {
  const base = (baseUrl || "http://localhost:3000").replace(/\/$/, "");
  return `${base}/track?trace=${encodeURIComponent(trackingNumber)}`;
}

export async function sendShipmentEmail(info: ShipmentEmailData): Promise<{ id: string }> {
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const resend = new Resend(RESEND_API_KEY);
  const trackingLink = buildTrackingLink(info.baseUrl, info.tracking_number);

  const subject = `Your C Link shipment ${info.tracking_number} is ${prettyStatus(info.status)}`;

  const html = `
  <!doctype html>
  <html lang="en">
    <body style="margin:0;padding:0;background:#f4f2ec;font-family:Inter,-apple-system,system-ui,sans-serif;color:#1a2740;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f2ec;padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e6e2d8;">
              <tr>
                <td style="background:#14213d;padding:32px 40px;">
                  <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">C Link Logistics &amp; Shipping</h1>
                  <p style="margin:8px 0 0;color:#8fa3c8;font-size:13px;">Shipment Tracking</p>
                </td>
              </tr>
              <tr>
                <td style="padding:40px;">
                  <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">
                    Your shipment <strong style="color:#14213d;">${info.tracking_number}</strong> is now
                    <strong style="color:#c85a28;">${prettyStatus(info.status)}</strong>.
                  </p>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e6e2d8;border-radius:6px;margin-bottom:24px;">
                    <tr>
                      <td style="padding:14px 20px;border-bottom:1px solid #f0ede5;width:40%;font-size:13px;color:#6b7280;">Tracking Number</td>
                      <td style="padding:14px 20px;border-bottom:1px solid #f0ede5;font-size:14px;font-weight:600;color:#14213d;">${info.tracking_number}</td>
                    </tr>
                    <tr>
                      <td style="padding:14px 20px;border-bottom:1px solid #f0ede5;width:40%;font-size:13px;color:#6b7280;">Status</td>
                      <td style="padding:14px 20px;border-bottom:1px solid #f0ede5;font-size:14px;font-weight:600;color:#c85a28;">${prettyStatus(info.status)}</td>
                    </tr>
                    <tr>
                      <td style="padding:14px 20px;border-bottom:1px solid #f0ede5;width:40%;font-size:13px;color:#6b7280;">Route</td>
                      <td style="padding:14px 20px;border-bottom:1px solid #f0ede5;font-size:14px;color:#14213d;">${info.origin} → ${info.destination}</td>
                    </tr>
                    <tr>
                      <td style="padding:14px 20px;border-bottom:1px solid #f0ede5;width:40%;font-size:13px;color:#6b7280;">Mode</td>
                      <td style="padding:14px 20px;border-bottom:1px solid #f0ede5;font-size:14px;color:#14213d;">${prettyStatus(info.mode)}</td>
                    </tr>
                    ${
                      info.current_location
                        ? `<tr><td style="padding:14px 20px;border-bottom:1px solid #f0ede5;width:40%;font-size:13px;color:#6b7280;">Current Location</td><td style="padding:14px 20px;border-bottom:1px solid #f0ede5;font-size:14px;color:#14213d;">${info.current_location}</td></tr>`
                        : ""
                    }
                    ${
                      info.eta
                        ? `<tr><td style="padding:14px 20px;width:40%;font-size:13px;color:#6b7280;">Estimated Delivery</td><td style="padding:14px 20px;font-size:14px;color:#14213d;">${new Date(info.eta).toLocaleString()}</td></tr>`
                        : ""
                    }
                  </table>
                  <a href="${trackingLink}" style="display:inline-block;background:#c85a28;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:6px;">
                    Track your shipment →
                  </a>
                  <p style="margin:24px 0 0;font-size:13px;color:#6b7280;line-height:1.6;">
                    If the button doesn't work, copy this link into your browser:<br />
                    <span style="color:#14213d;">${trackingLink}</span>
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background:#f4f2ec;padding:20px 40px;text-align:center;">
                  <p style="margin:0;font-size:12px;color:#6b7280;">© ${new Date().getFullYear()} C Link Logistics &amp; Shipping Pvt Ltd</p>
                  <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">Dubai · Karachi · Afghanistan · +91 98998 00655</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;

  const { data: resendData, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: info.customer_email,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return { id: resendData?.id ?? "" };
}

