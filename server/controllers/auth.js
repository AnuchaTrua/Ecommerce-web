// register
const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// register section
exports.register = async(req,res) => {

    try {
        const {email,password} = req.body;
        console.log(email,password);
        
        // check if user fill the email or not
        if(!email){
            return res.status(400).json({ message: "Email is required" });
        }
        // check if user fill the password or not
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // check email in DB under here
        const user = await prisma.user.findFirst({
            where:{
                email: email
            }
        });

        // if already have this user on DB return message
        if(user){
            return res.status(400).json({ message: "Email is already exist" });
        }


        //hash the password
        const hashPassword = await bcrypt.hash(password,10);
        
        // create Register
        await prisma.user.create({
            data: {
                email: email,
                password: hashPassword
            }
        })



        res.send("Register successful");
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
    
}

// login section
exports.login = async(req,res) => {
    try {
        const {email, password} = req.body;

        //check email 
        const user = await prisma.user.findFirst({
            where:{
                email: email
            }
        });
        if(!user || !user.enabled){
            return res.status(400).json({ message: "User not found or not enable" });
        }

        //check password
        const isMatch = await bcrypt.compare(password,user.password);

        if (!isMatch){
            return res.status(400).json({ message: "Password is incorrect" });
        }

        // payload
        const payload = {
            id: user.id,
            email:user.email,
            role: user.role
        }

        //generate token for how long u can stay login
        jwt.sign(payload,process.env.SECRET,{expiresIn:'1d'},(err,token) => {
            if (err){
                return res.status(500).json({ message: "Server error" });
            }
            // if no error
            res.json({payload, token});

        });
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
    
}

// current user auththenticator
exports.currentUser = async(req,res) => {
    try {
        res.send("Hi currentUser in controller");
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
    
}

