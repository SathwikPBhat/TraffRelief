const router = require('express').Router();
const {getStaffDetails, getCentreDetails, getDistinctRoles, getVictimDetails, getTraffickingTypes, getVictimsByGender, getVictimsByAge, getCentresForAnalytics, getVictimsByCentreHeatmap, getActiveCasesByCentre, getAdmissionTrend, getVictimsByStatus} = require('../controllers/stats.js');

router.get('/staff-details/:adminId', getStaffDetails);
router.get('/centre-details/:adminId', getCentreDetails);
router.get('/distinct-roles/:adminId', getDistinctRoles);
router.get('/victim-details/:adminId', getVictimDetails);
router.get('/get-trafficking-types/:adminId', getTraffickingTypes);
router.get('/get-victims-by-gender/:adminId', getVictimsByGender);
router.get('/get-victims-by-age/:adminId', getVictimsByAge);
router.get('/get-centres-for-analytics/:adminId', getCentresForAnalytics);
router.get('/get-victims-by-status/:adminId', getVictimsByStatus)
module.exports = router;