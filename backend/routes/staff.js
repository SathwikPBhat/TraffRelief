const express = require("express");
const { getVictims, getVictimById } = require("../controllers/staff.js");
const router = express.Router();

router.get('/get-victims/:staffId', getVictims);
router.get('/get-victim/:victimId', getVictimById);

module.exports = router;