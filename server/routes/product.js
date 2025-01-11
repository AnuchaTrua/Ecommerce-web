const express = require('express');
const router = express.Router();
//import controller
const {create,getProduct,read,update,remove,listby,searchFilters} = require('../controllers/product')



// endpoint
router.post('/product',create);
router.get('/products/:count',getProduct);
router.get('/product/:id',read);
router.put('/product/:id',update);
router.delete('/product/:id',remove);
router.post('/productby',listby);
router.post('/search/filter',searchFilters);





module.exports = router;