const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');


const CREDENTIALS = {
    client_id: '108680647050-7hj84i84o0lomel50apa0tegj8gvft3k.apps.googleusercontent.com',
    project_id: 'commanding-fact-427612-q1',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_secret: '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',
    redirect_uris: ['http://localhost:7000/meet'],
    javascript_origins: ['http://localhost:7000'],
};


const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const TOKEN_PATH = 'token.json';


const oAuth2Client = new google.auth.OAuth2(
    CREDENTIALS.client_id,
    CREDENTIALS.client_secret,
    CREDENTIALS.redirect_uris[0]
);


function getAccessToken() {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log('Authorize this app by visiting this URL:', authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);


            fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
            console.log('Token stored to', TOKEN_PATH);
        });
    });
}

fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
        getAccessToken();
    } else {
        oAuth2Client.setCredentials(JSON.parse(token));
        console.log('Token already exists:', token);
    }
});
