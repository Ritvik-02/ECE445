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

async function writeSheet(googleSheets, auth, spreadsheetId, cell, stat) {
    const resource = {
        values: [[stat]],
      };
    const data = await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: cell,
        valueInputOption: 'RAW',
        resource,
    });

    return data;
}

// handle the traffic
router.get('/', async (req, res) => {
    const sheet = await getGoogleSheet(auth);
    const data = await writeSheet(sheet, auth, CONSTS.GOOGLE_SHEETS.printingSheetId, "B2");
    console.log(data);
    res.send("UPDATE STATUS");
    // res.send(JSON.stringify([['room1', '0'], ['room2', '0']]));
});

router.post('/', async (req, res) => {
    var cell = "B" + (parseInt(req.body.room)+1).toString();
    var stat = req.body.status;
    console.log(cell);
    console.log(stat);
    const sheet = await getGoogleSheet(auth);
    const data = await writeSheet(sheet, auth, CONSTS.GOOGLE_SHEETS.printingSheetId, cell, stat);
    // console.log(data);
    res.send("UPDATE STATUS");
});

// export the router
module.exports = router;
