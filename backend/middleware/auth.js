const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = ( req, res, next )=>{
    // console.log('Headers:', req.headers);   
    const token = req.headers['authorization']?.split(' ')[1];
    // console.log("hihi",token)
    if(!token) return res.status(403).json({ error: "Accesses denied" })
        try {
            const decoded = jwt.verify(token, process.env.jwtToken);
            // console.log("helo",decoded)
            req.user = decoded;
            next();
            } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
            }
            };
           
module.exports ={ verifyToken};