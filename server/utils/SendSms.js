const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Initialize the Twilio client
const client = new twilio(accountSid, authToken);

const validatePhoneNumber = (number) => {
    // Simple validation for E.164 format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(number);
};

const sendMessage = async (options) => {
    if (!validatePhoneNumber(options.Contact)) {
        console.error(`Invalid phone number format: ${options.Contact}`);
        return {
            success: false,
            message: 'Invalid phone number format',
        };
    }

    try {
        const message = await client.messages.create({
            body: options.message,
            from: '+18083699329',
            to: "+917217619794" || options.Contact
        });

        console.log(`Message sent successfully: ${message.sid}`);
        return {
            success: true,
            messageSid: message.sid,
            message: 'Message sent successfully'
        };
    } catch (error) {
        console.error(`Error sending message: ${error.message}`);
        return {
            success: false,
            message: 'Failed to send message',
            error: error.message
        };
    }
};

module.exports = sendMessage;
