// get express & make router
const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const CONSTS = require('./../utils/constants');

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
    const sheet = await getGoogleSheet(auth);
    const data = await getSheet(sheet, auth, CONSTS.GOOGLE_SHEETS.printingSheetId);
    res.send(JSON.stringify(data));
    // res.send(JSON.stringify([['room1', '0'], ['room2', '0']]));
});

// export the router
module.exports = router;
