const router = require('express').Router();
const {handleAddStaff} = require('../controllers/admin.js');

router.post('/add-staff', handleAddStaff);

module.exports = router;