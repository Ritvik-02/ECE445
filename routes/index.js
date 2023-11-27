// get express & make router
const express = require('express');
const router = express.Router();

// handle the traffic
router.get('/', (req, res) => {
    res.render('index');
});

// export the router
module.exports = router;
