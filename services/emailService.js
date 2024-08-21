
const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


/**
 * Send user details via email.
 * @param {string} email - Recipient's email address
 * @param {string} password - User's password
 * @throws {Error} Throws an error if sending the email fails
 */
exports.sendUserDetails = async (email, password) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Account Details',
      text: `Here are your login details:\nEmail: ${email}\nPassword: ${password}`,
    };

    console.log("mailOptions",mailOptions)
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`User details sent to ${email}`);
    } catch (error) {
      console.error(`Failed to send user details to ${email}:`, error);
      throw new Error('Failed to send user details');
    }
  };
  
  /**
   * Notify the super admin with a custom subject and details.
   * @param {string} subject - Subject of the email
   * @param {Object} details - Details to be included in the email
   * @throws {Error} Throws an error if sending the email fails
   */
  exports.notifySuperAdmin = async (subject, details) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.SUPER_ADMIN_EMAIL,
      subject: subject,
      text: `Details: ${JSON.stringify(details)}`,
    };

    console.log("mailOptions: ",mailOptions)
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Notification sent to superadmin with subject: ${subject}`);
    } catch (error) {
      console.error(`Failed to notify superadmin with subject ${subject}:`, error);
      throw new Error('Failed to notify superadmin');
    }
  };


    /**
   * Notify the admin with a custom subject and details.
   * @param {string} subject - Subject of the email
   * @param {Object} details - Details to be included in the email
   * @throws {Error} Throws an error if sending the email fails
   */
     exports.notifyAdmin = async (subject, details,email) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: `Details: ${JSON.stringify(details)}`,
      };
  
      console.log("mailOptions: ",mailOptions)
    
      try {
        await transporter.sendMail(mailOptions);
        console.log(`Notification sent to admin with subject: ${subject}`);
      } catch (error) {
        console.error(`Failed to notify admin with subject ${subject}:`, error);
        throw new Error('Failed to notify admin');
      }
    };

    exports.resetPasswordMailService = async (subject, details,email) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: `Details: ${JSON.stringify(details)}`,
      };
  
      console.log("mailOptions: ",mailOptions)
    
      try {
        await transporter.sendMail(mailOptions);
        console.log(`Notification sent to user with subject: ${subject}`);
      } catch (error) {
        console.error(`Failed to notify user with subject ${subject}:`, error);
        throw new Error('Failed to notify user');
      }
    };

