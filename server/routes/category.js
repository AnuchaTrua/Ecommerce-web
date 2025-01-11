const express = require('express');
const router = express.Router();
const {create,getCate,remove} = require("../controllers/category");

// endpoint
router.post('/category',create)
router.get('/category',getCate)
router.delete('/category/:id',remove)



module.exports = router;