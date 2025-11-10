const express = require("express");
const { getVictims, getVictimById, getStaffById, getNotifications, addInitialDetails,getStaffAudits } = require("../controllers/staff.js");
const router = express.Router();
const upload = require('../middlewares/upload');
const { addAudit } = require("../controllers/audit.js");
const {evaluateAudit} = require("../controllers/gemini.js");
const {createRelease,submitRelease,viewReleaseResults,viewReleaseByVictim}=require("../controllers/release.js")
const {getPendingAudits}=require("../controllers/audit.js");
const {getReleasedVictims}=require("../controllers/staff.js");

router.get('/get-victims/:staffId', getVictims);
router.get('/get-victim/:victimId', getVictimById);
router.get('/get-staff/:staffId', getStaffById);
router.get('/getNotifications/:staffId', getNotifications);
router.post('/add-initial-details', upload.single('photo'), addInitialDetails);
router.post('/:staffId/:victimId/add-audit', addAudit,evaluateAudit)
router.get('/:staffId/audits', getStaffAudits);
router.post('/:staffId/create-release/:victimId', createRelease);
router.get('/:staffId/:victimId/view-release', viewReleaseByVictim);
router.post("/release/:hashId/submit", upload.single("audio"), submitRelease);
router.get("/release/:hashId/results", viewReleaseResults);

router.post('/:hashId', upload.single("audio"), submitRelease);
router.get('/:staffId/pending-audits', getPendingAudits);
router.get('/:staffId/released-victims',getReleasedVictims);

module.exports = router;