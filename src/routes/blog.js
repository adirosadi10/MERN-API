const express = require('express')
const {body} = require('express-validator')
const router = express.Router()
const blogController = require('../controllers/blog')

// http:localhost:4000/v1/customer
// ?page=1&perPage=5?page=1&perPage=5
router.post('/post',
 body('title').isLength({min: 5}).withMessage('Input title tidak sesuai'),
 body('body').isLength({min: 5}).withMessage('Input body tidak sesuai'),
 blogController.CreateBlogPost)
router.get('/posts', blogController.getAllBlogPosts)
router.get('/post/:postId', blogController.getBlogPostById)
router.put('/post/:postId',
 body('title').isLength({min: 5}).withMessage('Input title tidak sesuai'),
 body('body').isLength({min: 5}).withMessage('Input body tidak sesuai'),
 blogController.updateBlogPost)
router.delete('/post/:postId', blogController.deleteBlogPost)
module.exports = router