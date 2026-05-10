// Netlify Function to send invoice emails with PDF attachment
// Deploy this with your Netlify site

const nodemailer = require('nodemailer');

// Configure your email service here
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { email, clientName, invoice, pdfBase64, totalPaid, balance, statusLabel } = JSON.parse(event.body);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Invoice ${invoice.id} from Mejason Media - ${statusLabel}`,
      html: `
        <h2>Dear ${clientName},</h2>
        <p>Please find your invoice details below:</p>
        
        <h3>Invoice Information</h3>
        <p>
          <strong>Invoice #:</strong> ${invoice.id}<br/>
          <strong>Date:</strong> ${invoice.date}<br/>
          <strong>Status:</strong> ${statusLabel}
        </p>
        
        <h3>Items</h3>
        <table style="border-collapse:collapse;width:100%">
          ${invoice.items.map(i => `
            <tr>
              <td style="border:1px solid #ddd;padding:8px">${i.name}</td>
              <td style="border:1px solid #ddd;padding:8px;text-align:right">×${i.qty}</td>
              <td style="border:1px solid #ddd;padding:8px;text-align:right">KSh ${(i.price * i.qty).toLocaleString()}</td>
            </tr>
          `).join('')}
        </table>
        
        <h3>Summary</h3>
        <p>
          <strong>Subtotal:</strong> KSh ${invoice.subtotal.toLocaleString()}<br/>
          ${invoice.discountAmt > 0 ? `<strong>Discount (${invoice.discountPct}%):</strong> -KSh ${invoice.discountAmt.toLocaleString()}<br/>` : ''}
          <strong>Total Amount:</strong> KSh ${invoice.total.toLocaleString()}<br/>
          <strong>Amount Paid:</strong> KSh ${totalPaid.toLocaleString()}<br/>
          <strong style="color:red">Balance Due:</strong> KSh ${balance.toLocaleString()}
        </p>
        
        <h3>Payment Methods</h3>
        <p>
          📱 <strong>M-Pesa Till Number:</strong> 9013189<br/>
          🏦 <strong>Bank Transfer - KCB Bank</strong><br/>
          Account: 1310465029<br/>
          Account Name: Mejason Media Production<br/>
          💳 <strong>Credit/Cheque</strong> (as agreed)
        </p>
        
        <h3>Contact Information</h3>
        <p>
          📞 Phone: 0700864849 / 0768375441<br/>
          📧 Email: mejasanw@gmail.com<br/>
          Tax ID: 0771400615
        </p>
        
        <p>Thank you for choosing Mejason Media Production!</p>
        <p>
          Best regards,<br/>
          Mejason Media Production Team<br/>
          Kisumu, Kenya
        </p>
      `,
      attachments: [{
        filename: `${invoice.id}-invoice.pdf`,
        content: Buffer.from(pdfBase64, 'base64'),
        contentType: 'application/pdf'
      }]
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: `Email sent to ${email}` })
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
