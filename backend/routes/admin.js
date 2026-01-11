const router = require('express').Router();
const {handleAddStaff, viewStaffs, getActivityLogs, markAllNotificationsRead, getVictimDetails, addVictim, getUnassignedVictims, assignVictims,getAllAudits, getAdminDetails, getStaffAudits} = require('../controllers/admin.js');
const { getAuditDetails } = require('../controllers/audit.js');
const { verifyToken } = require('../middlewares/authentication.js');
const upload = require('../middlewares/upload');

router.post('/add-staff', verifyToken, handleAddStaff);
router.post('/add-victim', upload.single('file'), verifyToken, addVictim)
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

module.exports = router;