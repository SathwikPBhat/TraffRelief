const router = require('express').Router();
const {handleAddStaff, viewStaffs} = require('../controllers/admin.js');

router.post('/add-staff', handleAddStaff);
router.get('/view-staffs/:adminId', viewStaffs)

module.exports = router;