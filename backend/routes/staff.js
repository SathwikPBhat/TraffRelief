const express = require("express");
const { getVictims, getVictimById, getStaffById, getNotifications, addInitialDetails,getStaffAudits,getMyVictims } = require("../controllers/staff.js");
const router = express.Router();
const upload = require('../middlewares/upload');
const { addAudit } = require("../controllers/audit.js");
const {evaluateAudit} = require("../controllers/gemini.js");
const {createRelease,submitRelease,viewReleaseResults,viewReleaseByVictim}=require("../controllers/release.js")
const {getPendingAudits}=require("../controllers/audit.js");
const {getReleasedVictims}=require("../controllers/staff.js");
const { getAuditsByVictimId } = require('../controllers/audit.js');
const {verifyToken} = require('../middlewares/authentication.js')

router.get('/get-my-victims', verifyToken, getMyVictims);
router.get('/get-victims/:staffId', verifyToken, getVictims);
router.get('/get-victim/:victimId', verifyToken, getVictimById);
router.get('/get-staff/:staffId', verifyToken, getStaffById);
router.get('/getNotifications', verifyToken, getNotifications);
router.post('/add-initial-details', upload.single('photo'), verifyToken, addInitialDetails);
router.post('/:staffId/:victimId/add-audit', addAudit, verifyToken, evaluateAudit)
router.get('/:staffId/audits', verifyToken, getStaffAudits);
router.post('/:staffId/create-release/:victimId', createRelease);
router.get('/:staffId/:victimId/view-release', viewReleaseByVictim);
router.post("/release/:hashId/submit", upload.single("audio"), submitRelease);
router.get("/release/:hashId/results", viewReleaseResults);

router.post('/:hashId', upload.single("audio"), submitRelease);
router.get('/pending-audits', verifyToken, getPendingAudits);
router.get('/:staffId/released-victims', verifyToken, getReleasedVictims);
router.get('/victim/:victimId/audits', verifyToken, getAuditsByVictimId);

module.exports = router;