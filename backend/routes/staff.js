const express = require("express");
const { getVictims, getVictimById, getStaffById, getNotifications, addInitialDetails } = require("../controllers/staff.js");
const router = express.Router();
const upload = require('../middlewares/upload');

router.get('/get-victims/:staffId', getVictims);
router.get('/get-victim/:victimId', getVictimById);
router.get('/get-staff/:staffId', getStaffById);
router.get('/getNotifications/:staffId', getNotifications);
router.post('/add-initial-details', upload.single('photo'), addInitialDetails);

module.exports = router;