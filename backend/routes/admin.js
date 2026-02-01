const router = require('express').Router();
const {handleAddStaff, viewStaffs, getActivityLogs, markAllNotificationsRead, getVictimDetails, addVictim, getUnassignedVictims, assignVictims,getAllAudits, getAdminDetails, getStaffAudits, releaseVictim, verifyInitialDetails, discardInitialDetails} = require('../controllers/admin.js');
const { getAuditDetails, getVictimAuditHistory } = require('../controllers/audit.js');
const { verifyToken } = require('../middlewares/authentication.js');
const upload = require('../middlewares/upload');
const { uploadCloud } = require('../utils/cloudinary.js');

router.post('/add-staff', verifyToken, uploadCloud.single('photo'), handleAddStaff);
router.post('/add-victim', verifyToken, uploadCloud.single('file'), addVictim);
router.get('/view-staffs', verifyToken, viewStaffs)
router.get('/get-activity-details', verifyToken, getActivityLogs)
router.get('/get-victim-details', verifyToken, getVictimDetails)
router.get('/get-unassigned-victims', verifyToken, getUnassignedVictims);
router.patch('/mark-all-notifications-read', verifyToken, markAllNotificationsRead)
router.patch('/assign-victims', verifyToken, assignVictims);
router.get('/get-all-audits', verifyToken, getAllAudits);
router.get('/profile', verifyToken, getAdminDetails);
router.get('/audit-summary/:auditId', verifyToken, getAuditDetails);
router.get('/get-staff-audits/:staffId', verifyToken, getStaffAudits);
router.get('/:victimId/audit-history', verifyToken, getVictimAuditHistory);
router.patch('/release-victim/:victimId', verifyToken, releaseVictim);
router.patch("/verify-initial-details/:victimId", verifyToken, verifyInitialDetails);
router.delete("/discard-initial-details/:victimId", verifyToken, discardInitialDetails);

module.exports = router;