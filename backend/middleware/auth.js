const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = ( req, res, next )=>{
    const token = req.header('Authorization');
    if(!token) return res.status(400).json({ error: "Accesses denied" })
        try {
            const decoded = jwt.verify(token, process.env.jwtToken);
            req.email = decoded.userId;
            next();
            } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
            }
            };
           
module.exports = verifyToken;