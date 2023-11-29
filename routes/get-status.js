// get express & make router
const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const CONSTS = require('./../utils/constants');
const fs = require('fs');
const filePath = 'data.json';

// utils
const axios = require('axios').default;

// set up google sheets
const auth = new google.auth.GoogleAuth({
    keyFile: CONSTS.GOOGLE_SHEETS.keyFile,
    scopes: CONSTS.GOOGLE_SHEETS.scopes,
});

async function getGoogleSheet(auth) {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: CONSTS.GOOGLE_SHEETS.version, auth: client });
    return googleSheets;
}

async function getSheet(googleSheets, auth, spreadsheetId) {
    const data = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "A2:B",
    });

    return data.data.values;
}

// handle the traffic
router.get('/', async (req, res) => {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        console.log(jsonData);
        res.status(200);
        res.send(JSON.stringify(jsonData));
    } catch (error) {
        console.error(`Error reading from ${filePath}: ${error.message}`);
        res.status(400);
        res.send(JSON.stringify({"error" : "cant read"}));
    }
});

// export the router
module.exports = router;
