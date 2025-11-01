const router = require('express').Router();
const {handleAddStaff, viewStaffs, getActivityLogs, markAllNotificationsRead, getVictimDetails, addVictim} = require('../controllers/admin.js');
const upload = require('../middlewares/upload');

router.post('/add-staff', handleAddStaff);
router.post('/add-victim/:adminId', upload.single('file'), addVictim)
router.get('/view-staffs/:adminId', viewStaffs)
router.get('/get-activity-details/:adminId', getActivityLogs)
router.get('/get-victim-details/:adminId', getVictimDetails)
router.patch('/mark-all-notifications-read/:adminId', markAllNotificationsRead)

module.exports = router;