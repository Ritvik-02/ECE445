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
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        jsonData[req.body.room] = req.body.status;
        const jsonString = JSON.stringify({...jsonData});
        fs.writeFileSync(filePath, jsonString);
        res.status(200);
        res.send(JSON.stringify(jsonString));
    } catch (error) {
        console.error(`Error reading from ${filePath}: ${error.message}`);
        res.status(400);
        res.send(JSON.stringify({"error" : "cant read"}));
    }
});

// export the router
module.exports = router;
