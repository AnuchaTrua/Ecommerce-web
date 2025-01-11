const prisma = require("../config/prisma");



// create new product (1 product can have more than 1 image)
exports.create = async(req,res) => {

    try {
        const {title,description,price,quantity,categoryId,images} = req.body;
        console.log(title,description,price,quantity,images);

        const product = await prisma.product.create({
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: {
                    create: images.map((item) => ({
                        asset_id:item.asset_id,
                        public_id:item.public_id,
                        url:item.url,
                        secure_url:item.secure_url

                    }))
                }
            }
        });

        res.send(product);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
    
}

// get product
exports.getProduct = async(req,res) => {

    try {
        const {count} = req.params;
        const products = await prisma.product.findMany({
            take: parseInt(count), //define how many product you want to get
            orderBy: { createdAt : "desc"}, // sort the more than (newest item first)
            // show product's category for later use
            include: {
                category:true,
                images:true
            }
        });

        res.send(products);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
    
}

// read
exports.read = async(req,res) => {

    try {
        const {id} = req.params;
        const products = await prisma.product.findFirst({
            where: {
                id: Number(id)
            },
            
            include: {
                category:true,
                images:true
            }
        });

        res.send(products);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
    
}

// update product
exports.update = async(req,res) => {

    try {
        const {title,description,price,quantity,categoryId,images} = req.body;
        
        // clear image before update again
        await prisma.image.deleteMany({
            where: {
                productId: Number(req.params.id)
            }
        });



        const product = await prisma.product.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: {
                    create: images.map((item) => ({
                        asset_id:item.asset_id,
                        public_id:item.public_id,
                        url:item.url,
                        secure_url:item.secure_url

                    }))
                }
            }
        });

        res.send(product);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
    
}



// remove product not finish **************************************************
exports.remove = async(req,res) => {

    try {
        const {id} = req.params;
        await prisma.product.delete({
            where:{
                id: Number(id)
            }
        });

        res.send('Delete success');
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
    
}

// list by product (more than,less than,by price or anything)
exports.listby = async(req,res) => {

    try {
        const {sort,order,limit} = req.body;
        console.log(sort,order,limit);

        const products = await prisma.product.findMany({
            take: limit,
            orderBy: { [sort]:order },
            include:{ category:true}

        })

        res.send(products);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
    
}


// search for your product
const handleQuery = async(req,res,query) => {
    try{
        const products = await prisma.product.findMany({
            where:{
                title: {
                    contains: query,
                }

            },
            include:{
                category:true,
                images:true
            }
        });
        res.send(products);
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Search error'});
    }
}

// define price range for your shopping
const handlePrice = async(req,res,priceRange) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                price:{
                    gte: priceRange[0], // more than this
                    lte: priceRange[1] // less than this
                }
            },
            include: {
                category:true,
                images:true
            }
        });
        res.send(products);
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Price error'});
    }
}


// search product by category
const handleCategory = async(req,res,categoryId) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                categoryId:{
                    in: categoryId.map((id) => Number(id))
                    
                }
            },
            include: {
                category:true,
                images:true
            }
        });
        res.send(products);
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Price error'});
    }
}

// search product
exports.searchFilters = async(req,res) => {

    try {
        const { query,category,price} = req.body;

        if(query){
            console.log('query',query);
            await handleQuery(req,res,query);
        }
        if(category){
            console.log('category',category);
            await handleCategory(req,res,category);
        }
        if(price){
            console.log('price',price);
            await handlePrice(req,res,price);
        }

        
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
    
}