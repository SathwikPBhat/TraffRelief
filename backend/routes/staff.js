const express = require("express");
const { getVictims } = require("../controllers/staff.js");
const router = express.Router();

router.get('/get-victims/:staffId', getVictims);

module.exports = router;