const nodemailer = require('nodemailer');

const SendEmail = async (options) => {
    try {
        // Create the transporter with Gmail SMTP settings
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT, // Use port 587 
            auth: {
                user: process.env.SMTP_EMAIL_ID, // Your Gmail address
                pass: process.env.SMTP_EMAIL_PASSWORD // Your Gmail password or app-specific password
            }
        });

        // Send the email
        const info = await transporter.sendMail({
            from: process.env.SMTP_EMAIL_ID, // Sender address
            to: options.Email, // Recipient address
            subject: options.subject, // Subject line
            html: options.message // HTML body
        });

        console.log('Email sent: %s', info.messageId);

    } catch (error) {
        console.error('Error sending email: ', error);
    }
};

module.exports = SendEmail;