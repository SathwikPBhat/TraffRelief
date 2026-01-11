const express = require('express');
const router = express.Router();
const {handleLogin, fetchUserData} = require('../controllers/login.js');
const { verifyToken } = require('../middlewares/authentication.js');


router.post('/login', handleLogin);
router.get('/me', verifyToken, fetchUserData)

module.exports = router;