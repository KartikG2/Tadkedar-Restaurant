import nodemailer from 'nodemailer';
import { siteConfig } from './config';

// Lazy-init transporter — only create when actually sending
let _transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!_transporter && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    _transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return _transporter;
}

function getEmailEnabled() {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER.includes('@'));
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  items: { name: string; quantity: number; price: number; portion: string }[];
  total: number;
  orderType: string;
  address?: string;
  tableNumber?: string;
}

interface ReservationEmailData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
}

function baseStyle() {
  return `
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #FAF7F2; color: #1F1F1F; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 0 auto; background: #ffffff; }
    .header { background: #1F1F1F; padding: 32px 40px; text-align: center; }
    .header h1 { color: #FAF7F2; font-size: 24px; margin: 0; letter-spacing: 2px; }
    .header p { color: #C9A96E; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin: 6px 0 0; }
    .body { padding: 40px; }
    .body h2 { font-size: 18px; color: #1F1F1F; margin: 0 0 20px; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E8E3DD; font-size: 14px; }
    .info-label { color: #8A8579; }
    .info-value { color: #1F1F1F; font-weight: 500; }
    .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .items-table th { text-align: left; padding: 10px 0; border-bottom: 2px solid #E8E3DD; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #8A8579; }
    .items-table td { padding: 12px 0; border-bottom: 1px solid #E8E3DD; font-size: 14px; }
    .total-row td { font-weight: 600; font-size: 16px; border-top: 2px solid #1F1F1F; border-bottom: none; padding-top: 16px; }
    .footer { background: #FAF7F2; padding: 24px 40px; text-align: center; font-size: 12px; color: #8A8579; }
    .badge { display: inline-block; padding: 4px 12px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }
    .badge-gold { background: #C9A96E; color: #fff; }
  `;
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  if (!getEmailEnabled()) return;
  const t = getTransporter();
  if (!t) return;

  const orderTo = data.email || process.env.EMAIL_USER;
  const orderBcc = data.email ? process.env.EMAIL_USER : undefined;

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td>${item.name} ${item.portion !== 'Full' ? `<span style="color:#C9A96E">(${item.portion})</span>` : ''}</td>
        <td style="text-align:center">${item.quantity}</td>
        <td style="text-align:right">₹${item.price * item.quantity}</td>
      </tr>`
    )
    .join('');

  const html = `
  <html><head><style>${baseStyle()}</style></head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${siteConfig.name}</h1>
        <p>${siteConfig.tagline}</p>
      </div>
      <div class="body">
        <h2>Order Confirmed ✓</h2>
        <p style="color:#8A8579;font-size:14px;margin-bottom:24px">
          Thank you, ${data.customerName}! Your order #${data.orderNumber} has been received.
        </p>
        <div style="margin-bottom:24px">
          <div class="info-row"><span class="info-label">Order #</span><span class="info-value">${data.orderNumber}</span></div>
          <div class="info-row"><span class="info-label">Type</span><span class="info-value"><span class="badge badge-gold">${data.orderType}</span></span></div>
          <div class="info-row"><span class="info-label">Phone</span><span class="info-value">${data.phone}</span></div>
          ${data.address ? `<div class="info-row"><span class="info-label">Address</span><span class="info-value">${data.address}</span></div>` : ''}
          ${data.tableNumber ? `<div class="info-row"><span class="info-label">Table</span><span class="info-value">${data.tableNumber}</span></div>` : ''}
        </div>
        <table class="items-table">
          <tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Amount</th></tr>
          ${itemsHtml}
          <tr class="total-row"><td colspan="2">Total</td><td style="text-align:right">₹${data.total}</td></tr>
        </table>
        <p style="font-size:13px;color:#8A8579;margin-top:24px">
          We'll prepare your order fresh. Thank you for choosing ${siteConfig.name}!
        </p>
      </div>
      <div class="footer">
        ${siteConfig.fullName}<br>
        ${siteConfig.address.street}, ${siteConfig.address.city}<br>
        ${siteConfig.contact.phone}
      </div>
    </div>
  </body></html>`;

  try {
    await t.sendMail({
      from: `"${siteConfig.name}" <${process.env.EMAIL_USER}>`,
      to: orderTo,
      bcc: orderBcc,
      subject: `Order Confirmed #${data.orderNumber} — ${siteConfig.name}`,
      html,
    });
  } catch (err) {
    console.error('Email send error:', err);
  }
}

export async function sendEReceipt(data: OrderEmailData) {
  if (!getEmailEnabled() || !data.email) return;
  const t = getTransporter();
  if (!t) return;

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td>${item.name} ${item.portion !== 'Full' ? `(${item.portion})` : ''}</td>
        <td style="text-align:center">${item.quantity}</td>
        <td style="text-align:right">₹${item.price * item.quantity}</td>
      </tr>`
    )
    .join('');

  const html = `
  <html><head><style>${baseStyle()}</style></head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${siteConfig.name}</h1>
        <p>E-Receipt</p>
      </div>
      <div class="body">
        <h2 style="text-align:center;margin-bottom:4px">E-Receipt</h2>
        <p style="text-align:center;color:#8A8579;font-size:13px;margin-bottom:28px">Order #${data.orderNumber}</p>
        <div style="margin-bottom:24px">
          <div class="info-row"><span class="info-label">Customer</span><span class="info-value">${data.customerName}</span></div>
          <div class="info-row"><span class="info-label">Phone</span><span class="info-value">${data.phone}</span></div>
          <div class="info-row"><span class="info-label">Order Type</span><span class="info-value">${data.orderType}</span></div>
        </div>
        <table class="items-table">
          <tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Amount</th></tr>
          ${itemsHtml}
          <tr class="total-row"><td colspan="2">Grand Total</td><td style="text-align:right">₹${data.total}</td></tr>
        </table>
        <p style="text-align:center;font-size:12px;color:#8A8579;margin-top:30px;padding-top:20px;border-top:1px solid #E8E3DD">
          Thank you for dining with us!<br>Visit us again at ${siteConfig.address.city}
        </p>
      </div>
      <div class="footer">
        ${siteConfig.fullName}<br>
        ${siteConfig.contact.phone} | ${siteConfig.contact.email}
      </div>
    </div>
  </body></html>`;

  try {
    await t.sendMail({
      from: `"${siteConfig.name}" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: `E-Receipt #${data.orderNumber} — ${siteConfig.name}`,
      html,
    });
  } catch (err) {
    console.error('E-Receipt email error:', err);
  }
}

export async function sendReservationConfirmation(data: ReservationEmailData) {
  if (!getEmailEnabled()) return;
  const t = getTransporter();
  if (!t) return;

  const resTo = data.email || process.env.EMAIL_USER;
  const resBcc = data.email ? process.env.EMAIL_USER : undefined;

  const html = `
  <html><head><style>${baseStyle()}</style></head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${siteConfig.name}</h1>
        <p>${siteConfig.tagline}</p>
      </div>
      <div class="body">
        <h2>Reservation Confirmed ✓</h2>
        <p style="color:#8A8579;font-size:14px;margin-bottom:24px">
          Hello ${data.name}, your table has been reserved!
        </p>
        <div style="margin-bottom:24px">
          <div class="info-row"><span class="info-label">Date</span><span class="info-value">${data.date}</span></div>
          <div class="info-row"><span class="info-label">Time</span><span class="info-value">${data.time}</span></div>
          <div class="info-row"><span class="info-label">Guests</span><span class="info-value">${data.guests}</span></div>
          <div class="info-row"><span class="info-label">Phone</span><span class="info-value">${data.phone}</span></div>
          ${data.notes ? `<div class="info-row"><span class="info-label">Notes</span><span class="info-value">${data.notes}</span></div>` : ''}
        </div>
        <p style="font-size:13px;color:#8A8579">
          We look forward to welcoming you. If you need to modify your reservation, please call us at ${siteConfig.contact.phone}.
        </p>
      </div>
      <div class="footer">
        ${siteConfig.fullName}<br>
        ${siteConfig.address.street}, ${siteConfig.address.city}<br>
        ${siteConfig.contact.phone}
      </div>
    </div>
  </body></html>`;

  try {
    await t.sendMail({
      from: `"${siteConfig.name}" <${process.env.EMAIL_USER}>`,
      to: resTo,
      bcc: resBcc,
      subject: `Reservation Confirmed — ${siteConfig.name}`,
      html,
    });
  } catch (err) {
    console.error('Reservation email error:', err);
  }
}
