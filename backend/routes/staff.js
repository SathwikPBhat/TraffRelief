const express = require("express");
const { getVictims, getVictimById, getStaffById, getNotifications } = require("../controllers/staff.js");
const router = express.Router();

router.get('/get-victims/:staffId', getVictims);
router.get('/get-victim/:victimId', getVictimById);
router.get('/get-staff/:staffId', getStaffById);
router.get('/getNotifications/:staffId', getNotifications);

module.exports = router;