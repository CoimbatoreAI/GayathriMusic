import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Email configuration using Nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// WhatsApp configuration (using Twilio) - conditionally initialized
let twilioClient: ReturnType<typeof twilio> | null = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

export interface WelcomeMessageData {
  studentName: string;
  courseName: string;
  courseLevel: string;
  startDate: string;
  contactNumber: string;
  email: string;
  totalAmount: number;
}

export interface EnrollmentNotificationData {
  studentName: string;
  studentAge: number;
  contactNumber: string;
  email: string;
  location: string;
  courseType: string;
  courseLevel: string;
  preferredLanguage: string;
  totalAmount: number;
  enrollmentId: string;
  paymentMethod: string;
  enrollmentDate: string;
}

export class NotificationService {

  static async sendWelcomeEmail(data: WelcomeMessageData): Promise<void> {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('⚠️ Email credentials not configured - skipping welcome email');
        return;
      }

      const transporter = createTransporter();
      const emailHtml = this.generateWelcomeEmailHTML(data);

      const mailOptions = {
        from: process.env.EMAIL_FROM || '"Gayathri Music Academy" <thulasi5885@gmail.com>',
        to: data.email,
        subject: `🎵 Welcome to Carnatic Music Classes!`,
        html: emailHtml
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent successfully: ${info.messageId}`);
    } catch (error: unknown) {
      console.error('❌ Welcome email sending failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  static async sendWelcomeWhatsApp(data: WelcomeMessageData): Promise<void> {
    try {
      if (!twilioClient) {
        console.log('❌ Twilio not configured - skipping WhatsApp message');
        return;
      }

      const message = this.generateWelcomeWhatsAppMessage(data);

      await twilioClient.messages.create({
        body: message,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${data.contactNumber.startsWith('+') ? data.contactNumber : '+91' + data.contactNumber}`
      });

      console.log(`✅ WhatsApp message sent to ${data.contactNumber}`);
    } catch (error: unknown) {
      console.error('❌ Error sending WhatsApp message:', error instanceof Error ? error.message : 'Unknown error');
      // Don't throw error to avoid breaking enrollment process
    }
  }

  static async sendWelcomeNotifications(data: WelcomeMessageData): Promise<void> {
    try {
      // Send both email and WhatsApp in parallel
      await Promise.allSettled([
        this.sendWelcomeEmail(data),
        this.sendWelcomeWhatsApp(data)
      ]);

      console.log('✅ Welcome notifications process completed');
    } catch (error: unknown) {
      console.error('❌ Error in welcome notifications process:', error instanceof Error ? error.message : 'Unknown error');
      // Don't throw error to avoid breaking enrollment process
    }
  }

  static async sendEnrollmentNotificationToAdmin(data: EnrollmentNotificationData): Promise<void> {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('⚠️ Email credentials not configured - skipping admin notification');
        return;
      }

      const transporter = createTransporter();
      const emailHtml = this.generateAdminEnrollmentNotificationHTML(data);
      const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'thulasi5885@gmail.com';

      const mailOptions = {
        from: process.env.EMAIL_FROM || '"Gayathri Music Academy" <thulasi5885@gmail.com>',
        to: adminEmail,
        subject: `🎵 New Student Enrollment - ${data.studentName}`,
        html: emailHtml
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Admin enrollment notification sent: ${info.messageId}`);
    } catch (error: unknown) {
      console.error('❌ Admin notification email failed:', error instanceof Error ? error.message : 'Unknown error');
      // Don't throw error to avoid breaking the enrollment process
      console.error('❌ Email notification failed, but enrollment continues');
    }
  }

  private static generateWelcomeEmailHTML(data: WelcomeMessageData): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Carnatic Music Classes</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #7c3aed, #a855f7); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .welcome-message { font-size: 18px; margin-bottom: 20px; }
          .course-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed; }
          .next-steps { background: #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .contact-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
          .highlight { color: #7c3aed; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎵 Welcome to Carnatic Music Classes!</h1>
            <p>Your musical journey begins here</p>
          </div>

          <div class="content">
            <div class="welcome-message">
              <p>Dear <span class="highlight">${data.studentName}</span>,</p>
              <p>🎉 Congratulations! You have successfully enrolled in Carnatic Music classes with <strong>Gayathri Thulasi</strong>.</p>
              <p>We are thrilled to have you join our musical family and embark on this beautiful journey of learning the divine art of Carnatic music.</p>
            </div>

            <div class="course-details">
              <h3>📚 Your Course Details</h3>
              <ul>
                <li><strong>Course:</strong> ${data.courseName}</li>
                <li><strong>Level:</strong> ${data.courseLevel}</li>
                <li><strong>Start Date:</strong> ${data.startDate}</li>
                <li><strong>Total Amount Paid:</strong> ₹${data.totalAmount.toLocaleString()}</li>
              </ul>
            </div>

            <div class="next-steps">
              <h3>🚀 What Happens Next?</h3>
              <ol>
                <li>You will receive your class schedule within 24 hours</li>
                <li>Download the required learning materials from our student portal</li>
                <li>Join your first class at the scheduled time</li>
                <li>Connect with fellow music enthusiasts in our community</li>
              </ol>
            </div>

            <div class="contact-info">
              <h3>📞 Need Help?</h3>
              <p>Feel free to reach out to us:</p>
              <ul>
                <li><strong>Phone:</strong> +91 98765 43210</li>
                <li><strong>Email:</strong> gayathri.thulasi@gmail.com</li>
                <li><strong>Address:</strong> Chennai, Tamil Nadu, India</li>
              </ul>
            </div>

            <p style="text-align: center; margin: 30px 0;">
              <strong>Remember:</strong> "Music is the universal language of mankind." - Henry Wadsworth Longfellow
            </p>

            <p style="text-align: center;">
              We look forward to creating beautiful music together! 🎼
            </p>
          </div>

          <div class="footer">
            <p>© ${new Date().getFullYear()} Gayathri Thulasi Carnatic Music Academy. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private static generateWelcomeWhatsAppMessage(data: WelcomeMessageData): string {
    return `🎵 *Welcome to Carnatic Music Classes!* 🎵

Dear ${data.studentName},

🎉 Congratulations! You have successfully enrolled in Carnatic Music classes with *Gayathri Thulasi*.

📚 *Your Course Details:*
• Course: ${data.courseName}
• Level: ${data.courseLevel}
• Start Date: ${data.startDate}
• Total Amount Paid: ₹${data.totalAmount.toLocaleString()}

🚀 *What Happens Next:*
1. You will receive your class schedule within 24 hours
2. Download learning materials from our student portal
3. Join your first class at the scheduled time
4. Connect with our music community

📞 *Need Help?*
Contact us at: +91 98765 43210
Email: gayathri.thulasi@gmail.com

*"Music is the universal language of mankind."*

We look forward to creating beautiful music together! 🎼

*Gayathri Thulasi Carnatic Music Academy*
Chennai, Tamil Nadu, India`;
  }

  private static generateAdminEnrollmentNotificationHTML(data: EnrollmentNotificationData): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Student Enrollment</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .student-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626; }
          .course-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed; }
          .payment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669; }
          .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
          .highlight { color: #dc2626; font-weight: bold; }
          .success { color: #059669; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎵 New Student Enrollment Alert!</h1>
            <p>A new student has enrolled through Razorpay</p>
          </div>

          <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #dc2626; margin: 0;">New Enrollment Received</h2>
              <p style="color: #6c757d; margin: 10px 0;">Razorpay payment completed successfully</p>
            </div>

            <div class="student-details">
              <h3>👤 Student Information</h3>
              <ul>
                <li><strong>Student Name:</strong> ${data.studentName}</li>
                <li><strong>Age:</strong> ${data.studentAge} years</li>
                <li><strong>Contact Number:</strong> ${data.contactNumber}</li>
                <li><strong>Email:</strong> ${data.email}</li>
                <li><strong>Location:</strong> ${data.location}</li>
                <li><strong>Preferred Language:</strong> ${data.preferredLanguage}</li>
                <li><strong>Enrollment ID:</strong> <span class="highlight">${data.enrollmentId}</span></li>
                <li><strong>Enrollment Date:</strong> ${data.enrollmentDate}</li>
              </ul>
            </div>

            <div class="course-details">
              <h3>📚 Course Information</h3>
              <ul>
                <li><strong>Course Type:</strong> ${data.courseType}</li>
                <li><strong>Course Level:</strong> ${data.courseLevel}</li>
              </ul>
            </div>

            <div class="payment-details">
              <h3>💳 Payment Information</h3>
              <ul>
                <li><strong>Total Amount:</strong> <span class="success">₹${data.totalAmount.toLocaleString()}</span></li>
                <li><strong>Payment Method:</strong> <span class="highlight">${data.paymentMethod}</span></li>
                <li><strong>Payment Status:</strong> <span class="success">✅ COMPLETED</span></li>
              </ul>
            </div>

            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h3>⚡ Action Required</h3>
              <ol>
                <li>Send welcome email and WhatsApp to student</li>
                <li>Schedule the first class</li>
                <li>Prepare course materials</li>
                <li>Add student to class register</li>
              </ol>
            </div>

            <p style="text-align: center; margin: 30px 0;">
              <strong>📞 Contact Student:</strong><br>
              Phone: ${data.contactNumber}<br>
              Email: ${data.email}
            </p>

            <p style="text-align: center;">
              This student is ready to start their musical journey! 🎼
            </p>
          </div>

          <div class="footer">
            <p>© ${new Date().getFullYear()} Gayathri Thulasi Carnatic Music Academy. All rights reserved.</p>
            <p>This is an automated notification for new enrollments.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}