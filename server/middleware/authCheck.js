// authenticator check
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');



// check this user is available or not
exports.authCheck = async(req,res,next) => {
    try {

        const headerToken = req.headers.authorization;
        console.log(headerToken)
        if(!headerToken){
            return res.status(401).json({message: "No token, Authorization"});
        }
        const token = headerToken.split(" ")[1];

        const decode = jwt.verify(token,process.env.SECRET);
        req.user = decode; // add key for store user


        // Check all data of specific user
        const user = await prisma.user.findFirst({
            where: {
                email: req.user.email
            }
        });

        // check if this user disable or not
        if (!user.enabled) {
            return res.status(400).json({message: "This user cannot access"});
        }
        
        
        next();
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Invalid token"})
    }
}

// check this user is admin or not
exports.adminCheck = async(req,res,next) => {
    try{
        const {email} = req.user;
        
        const adminUser = await prisma.user.findFirst({
            where: {
                email: email // write the code like this for understanding i can use only email and is fine
            }
        });

        if(!adminUser || adminUser.role != "admin"){
            return res.status(403).json({message: "Access denied (This is for admin only)"});
        }

        console.log("Admin check",adminUser);
        next();
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Admin access denied"})
    }
}