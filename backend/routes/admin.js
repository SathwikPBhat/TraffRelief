const router = require('express').Router();
const {handleAddStaff, viewStaffs, getActivityLogs, markAllNotificationsRead} = require('../controllers/admin.js');

router.post('/add-staff', handleAddStaff);
router.get('/view-staffs/:adminId', viewStaffs)
router.get('/get-activity-details/:adminId', getActivityLogs)
router.patch('/mark-all-notifications-read/:adminId', markAllNotificationsRead)
module.exports = router;