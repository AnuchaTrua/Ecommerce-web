const express = require('express');
const { authCheck } = require('../middleware/authCheck');
const {changeOrderStatus,getOrderAdmin} = require('../controllers/admin');
const router = express.Router();



// endpoint
router.put('/admin/order-status',authCheck,changeOrderStatus);
router.get('/admin/orders',authCheck,getOrderAdmin);




module.exports = router;