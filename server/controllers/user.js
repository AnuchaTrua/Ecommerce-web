const prisma = require("../config/prisma");

//list user
exports.listUsers = async (req,res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                enabled: true,
                address: true
            }
        });
        res.json(users);
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Server error"})
    }
}

// change status of user
exports.changeStatus = async (req,res) => {
    try {
        const {id,enabled} = req.body;
        console.log(id,enabled);

        const user = await prisma.user.update({
            where: {
                id :Number(id)
            },
            data: {
                enabled: enabled
            }
        });
        res.send('Updated executed');
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Server error"})
    }
}

// change role
exports.changeRole = async (req,res) => {
    try {
        const {id,role} = req.body;
        console.log(id,role);

        const user = await prisma.user.update({
            where: {
                id :Number(id)
            },
            data: {
                role: role
            }
        });
        res.send('Updated role executed');
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Server error"})
    }
}


// add user cart
exports.userCart = async (req,res) => {
    try {
        const {cart} = req.body;
        // console.log(cart);

        // console.log(req.user.id);

        const user = await prisma.user.findFirst({
            where: {
                id: Number(req.user.id)
            }
        });
        console.log(user);

        // delete old cart item to add new product
        await prisma.productOnCart.deleteMany({
            where: {
                cart: { 
                    orderedById :user.id
                }
            }
        });

        //delete old cart before add new one
        await prisma.cart.deleteMany({
            where: {
                orderedById: user.id
            }
        });

        // prepare product to calculate
        let products = cart.map((item) => ({
            productId: item.id,
            count: item.count,
            price: item.price,
        }))

        //cart total price
        let cartTotal = products.reduce((sum,item) => sum + item.price * item.count,0); // 0 is default price


        // new cart
        const newCart = await prisma.cart.create({
            data: {
                products: {
                    create:products
                },
                cartTotal:cartTotal,
                orderedById: user.id
            }
        });

        console.log(newCart);

        res.send('Add cart success');
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Server error"})
    }
}


// get user cart
exports.getUserCart = async (req,res) => {
    try {
        const cart = await prisma.cart.findFirst({
            where: {
                orderedById: Number(req.user.id)
            },
            include: {
                products: {
                    include:{
                        product: true
                    }
                }
            }
        });
        // console.log(cart);

        // show product in cart and end with total price
        res.send({
            products: cart.products,
            cartTotal: cart.cartTotal
        });
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Server error"})
    }
}

// empty user cart (clear data in cart)
exports.emptyCart = async (req,res) => {
    try {
        // find cart of this id
        const cart = await prisma.cart.findFirst({
            where: {
                orderedById: Number(req.user.id)
            }
        });
        // if no cart to delete
        if(!cart){
            res.status(400).json({message: "No cart to delete"})
        }

        // then delete product in cart
        await prisma.productOnCart.deleteMany({
            where: {
                cartId: cart.id
            }
        });

        // and delete cart
        const result = await prisma.cart.deleteMany({
            where: {
                orderedById: Number(req.user.id)
            }
        });


        console.log(result);
        res.json({message:"Cart empty sucess",
            deletedCount: result.count
        });
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Server error"});
    }
}

// save order
exports.saveAddress = async (req,res) => {
    try {
        const { address } = req.body;
        
        const addressUser = await prisma.user.update({
            where:{
                id: Number(req.user.id)
            },
            data: {
                address: address
            }
        });

        res.json({ok: true, message: "Save address sucess"});
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Server error"})
    }
}

// save order
exports.saveOrder = async (req,res) => {
    try {

        const userCart = await prisma.cart.findFirst({
            where: {
                orderedById: Number(req.user.id)
            },
            include: {
                products: true
            }
        });

        // Check is cart empty or not
        if (!userCart || userCart.products.length === 0) {
            return res.status(400).json({ok: false, message: "No product to save order"})
        }

        // check quantity
        for( const item of userCart.products) {
            
            // find product to check is order less than or more than quantity of available product
            const product = await prisma.product.findUnique({
                where: { id: item.productId},
                select: { quantity: true,title:true}
            });
            // console.log(item);
            // console.log(product);
            if (!product || item.count > product.quantity){
                return res.status(400).json({ok: false, message: `Sorry, ${product?.title} not available`});

            }
        }

        // create new order
        const order = await prisma.order.create({
            data: {
                products: {
                    // loop throught product because sometime user buy many product
                    create: userCart.products.map((item) => ({
                        productId: item.productId,
                        count: item.count,
                        price: item.price
                        
                    }))
                },
                orderedBy:{
                    connect: {
                        id: req.user.id
                    }
                },
                cartTotal: userCart.cartTotal
            }
        });
        
        // update product
        const update = userCart.products.map((item) =>({
            where: {id: item.productId},
            data: {
                // update decrease product quantity after purchase
                quantity: {decrement: item.count},
                // update increase product sold quantity after purchase
                sold: { increment: item.count}
            }
        }));

        console.log(update);

        // update everything in DB
        await Promise.all(
            update.map((updated) => prisma.product.update(updated))
        );

        // delete everything in cart after purchase
        await prisma.cart.deleteMany({
            where: {
                orderedById: Number(req.user.id)
            }
        });

        

        res.json({ok:true, order});
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Server error"})
    }
}

// save order
exports.getOrder = async (req,res) => {
    try {

        const orders = await prisma.order.findMany({
            where: {
                orderedById: Number(req.user.id)
            },
            include: {
                products:{
                    include: {
                        product: true
                    }
                }
            }
        });

        if(orders.length === 0) {
            return res.status(400).json({ok: false, message:"No order"})
        }

        


        res.json({ok: true, orders})
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Server error"})
    }
}