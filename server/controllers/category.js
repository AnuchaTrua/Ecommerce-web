//create category
const prisma = require('../config/prisma');

// create category
exports.create = async(req,res) => {

    try {
        const {name} = req.body;
        const category = await prisma.category.create({
            data: {
                name: name
            }
        });

        res.send(category);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
    
}

//get category
exports.getCate = async(req,res) => {

    try {
        const category = await prisma.category.findMany();
        res.send(category);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
    
}

//delete category
exports.remove = async(req,res) => {

    try {
        // check delete id
        const {id} = req.params;
        const category = await prisma.category.delete({
            where: {
                id: Number(id)
            }
        });
        res.send(category);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
    
}