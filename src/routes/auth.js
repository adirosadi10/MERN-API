const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')

// http:localhost:4000/v1/customer
router.post('/register', authController.register)
// router.get('/products', productsController.getAllProducts )


module.exports = router