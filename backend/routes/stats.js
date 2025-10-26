const router = require('express').Router();
const {getStaffDetails, getCentreDetails, getDistinctRoles} = require('../controllers/stats.js');

router.get('/staff-details/:adminId', getStaffDetails);
router.get('/centre-details/:adminId', getCentreDetails);
router.get('/distinct-roles/:adminId', getDistinctRoles);

module.exports = router;