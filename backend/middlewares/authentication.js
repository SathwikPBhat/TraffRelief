const jwt = require('jsonwebtoken');

function verifyToken(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message: 'Unauthorized user'});
    }
    const token = authHeader.split(' ')[1];
    try{
        req.user = jwt.verify(token, process.env.SECRET_KEY);
        next();
    }
    catch(err){
        return res.status(403).json({message: 'Forbidden access'});
    }
}

module.exports = {verifyToken};