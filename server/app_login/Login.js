const { google } = require('googleapis');

const CLIENT_ID = '108680647050-7hj84i84o0lomel50apa0tegj8gvft3k.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:7000/meet';

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);


s