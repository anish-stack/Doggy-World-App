const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const crypto = require('crypto');
const fs = require('fs');
const TOKEN_PATH = 'token.json';
const CLIENT_ID = '108680647050-7hj84i84o0lomel50apa0tegj8gvft3k.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:7000/api/meet';

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

// Load previously stored token
if (fs.existsSync(TOKEN_PATH)) {
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
} else {
    console.log('Token not found, please authenticate again.');
}

router.get('/google', (req, res) => {
    try {
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/calendar',
                'https://www.googleapis.com/auth/calendar.events'
            ],
        });
        res.json({ url }); 
    } catch (error) {
        console.error('Error generating auth URL:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/meet', async (req, res) => {
    const code = req.query.code;
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        console.log("tokens", tokens);

        // Save the token to token.json
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
        console.log('Token stored to', TOKEN_PATH);

        oAuth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({
            auth: oAuth2Client,
            version: 'v2',
        });

        const { data } = await oauth2.userinfo.get();
        console.log("user", data);
        req.session.user = data;

        res.send('Authentication successful! You can close this window.');
    } catch (error) {
        console.error('Error retrieving tokens:', error);
        res.redirect('/');
    }
});

async function authorize() {
    try {
        const token = fs.readFileSync('token.json');
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client;
    } catch (error) {
        console.error('Error loading token:', error);
        throw new Error('Authorization failed');
    }
}

router.post('/schedule-meeting', async (req, res) => {
    try {
        const { title, startTime, endTime, attendeesEmails } = req.body;

        const authClient = await authorize();

        const calendar = google.calendar({ version: 'v3', auth: authClient });

        const event = {
            summary: title,
            description: 'Google Meet meeting link will be included.',
            start: {
                dateTime: startTime,
                timeZone: 'Asia/Kolkata',
            },
            end: {
                dateTime: endTime,
                timeZone: 'Asia/Kolkata',
            },
            attendees: attendeesEmails.map((email) => ({ email })),
            conferenceData: {
                createRequest: {
                    requestId: crypto.randomBytes(5).toString('hex'),
                    conferenceSolutionKey: {
                        type: 'hangoutsMeet',
                    },
                },
            },
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1,
        });

        const meetLink = response.data.hangoutLink;

        res.json({
            message: 'Meeting scheduled successfully',
            meetLink: meetLink,
            eventId: response.data.id,
        });

    } catch (error) {
        console.error('Error scheduling meeting:', error);
        res.status(500).json({ error: 'Error scheduling the meeting' });
    }
});

module.exports = router;
