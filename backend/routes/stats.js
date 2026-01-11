const router = require('express').Router();
const {getStaffDetails, getCentreDetails, getDistinctRoles, getVictimDetails, getTraffickingTypes, getVictimsByGender, getVictimsByAge, getCentresForAnalytics, getVictimsByCentreHeatmap, getActiveCasesByCentre, getAdmissionTrend, getVictimsByStatus} = require('../controllers/stats.js');
const { verifyToken } = require('../middlewares/authentication.js');

router.get('/staff-details', verifyToken, getStaffDetails);
router.get('/centre-details', verifyToken, getCentreDetails);
router.get('/distinct-roles', verifyToken, getDistinctRoles);
router.get('/victim-details', verifyToken, getVictimDetails);
router.get('/get-trafficking-types', verifyToken, getTraffickingTypes);
router.get('/get-victims-by-gender', verifyToken, getVictimsByGender);
router.get('/get-victims-by-age',  verifyToken, getVictimsByAge);
router.get('/get-centres-for-analytics',  verifyToken, getCentresForAnalytics);
router.get('/get-victims-by-status', verifyToken, getVictimsByStatus)

module.exports = router;