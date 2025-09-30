import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmation({
  to,
  bookingDetails,
  chaletDetails
}) {
  const { guest, dates, pricing, confirmationNumber } = bookingDetails;
  const { title, location } = chaletDetails;

  const mailOptions = {
    from: `"Chalet Manager" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: `Booking Confirmation - ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #8B4513; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">Booking Confirmed!</h1>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #8B4513; margin-top: 0;">Dear ${guest.firstName} ${guest.lastName},</h2>
          
          <p>Thank you for your booking! We're excited to welcome you to <strong>${title}</strong>.</p>
          
          <div style="background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #8B4513;">
            <h3 style="margin-top: 0; color: #8B4513;">Booking Details</h3>
            <p><strong>Confirmation Number:</strong> ${confirmationNumber}</p>
            <p><strong>Property:</strong> ${title}</p>
            <p><strong>Location:</strong> ${location.address}, ${location.city}</p>
            <p><strong>Check-in:</strong> ${new Date(dates.checkIn).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> ${new Date(dates.checkOut).toLocaleDateString()}</p>
            <p><strong>Guests:</strong> ${guest.adults} Adults${guest.children > 0 ? `, ${guest.children} Children` : ''}</p>
            <p><strong>Total Amount:</strong> €${pricing.totalAmount}</p>
          </div>
          
          <div style="background-color: #FEF7ED; padding: 15px; margin: 20px 0; border-radius: 8px;">
            <h4 style="margin-top: 0; color: #8B4513;">What's Next?</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>You'll receive check-in instructions 24 hours before arrival</li>
              <li>Contact us if you have any special requirements</li>
              <li>We'll send you local recommendations closer to your stay</li>
            </ul>
          </div>
          
          <p style="margin-bottom: 0;">If you have any questions, please don't hesitate to contact us.</p>
          
          <p style="margin-top: 20px;">
            Best regards,<br>
            <strong>The Chalet Management Team</strong>
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
    throw new Error('Failed to send confirmation email');
  }
}

/**
 * Send contact form inquiry
 */
export async function sendContactInquiry({ name, email, subject, message }) {
  const mailOptions = {
    from: `"Website Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `Contact Form: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #8B4513;">New Contact Form Submission</h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
          <h3 style="margin-top: 0;">Message:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Contact inquiry sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending contact inquiry:', error);
    throw new Error('Failed to send inquiry');
  }
}

/**
 * Send password reset email (for future use)
 */
export async function sendPasswordReset({ to, resetToken, resetUrl }) {
  const mailOptions = {
    from: `"Chalet Manager" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #8B4513;">Password Reset Request</h2>
        
        <p>You requested a password reset for your account.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p><small>This link will expire in 1 hour. If you didn't request this reset, you can ignore this email.</small></p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset:', error);
    throw new Error('Failed to send password reset email');
  }
}

export default transporter;