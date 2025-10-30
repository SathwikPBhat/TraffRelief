const router = require('express').Router();
const {getStaffDetails, getCentreDetails, getDistinctRoles, getVictimDetails} = require('../controllers/stats.js');

router.get('/staff-details/:adminId', getStaffDetails);
router.get('/centre-details/:adminId', getCentreDetails);
router.get('/distinct-roles/:adminId', getDistinctRoles);
router.get('/victim-details/:adminId', getVictimDetails);

module.exports = router;