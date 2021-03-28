const { validationResult } = require("express-validator")
const path = require('path')
const fs = require('fs')
const blogPost = require('../models/blog')

exports.CreateBlogPost = (req, res, next) => {
  
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    const err = new Error('Input Value tidak sesuai')
    err.errorStatus = 400
    err.data = errors.array()
    throw err
  }
  if(!req.file){
    const err = new Error('Image harus diUpload')
    err.errorStatus = 422
    throw err
  }
  const title = req.body.title
  const image = req.file.path
  const body = req.body.body

  const posting = new blogPost({
    title: title,
    image: image,
    body: body,
    author: {uid: 1, name: 'ube'}
  })
  posting.save()
  .then(result => {
    res.status(201).json({
      message : "Create blog post Success",
      data : result
    })
  })
  .catch(err => {
    console.log('err: ', err)
  })
 
}

exports.getAllBlogPosts = (req, res, next) => {
  const currentPage = req.query.page || 1
  const perPage = req.query.perPage || 2
  let totalItems

  blogPost.find()
  .countDocuments()
  .then(count => {
    totalItems = count
    return blogPost.find()
    .skip((parseInt(currentPage) - 1) * parseInt(perPage))
    .limit(parseInt(perPage))
  })
  .then(result => {
    res.status(200).json({
      message: 'Data berhasil dipanggil',
      data: result,
      total_data: totalItems,
      current_page: parseInt(currentPage),
      per_page: parseInt(perPage)
    })
  })
  .catch(err => {
    next(err)
  })  
}

exports.getBlogPostById = ( req, res, next) => {
  const postId = req.params.postId
  blogPost.findById(postId)
  .then(result => {
    if(!result) {
      const error = new Error('Blog post tidak ditemukan')
      error.errorStatus = 404
      throw error
    }
    res.status(200).json({
      message : 'Data berhasil ditemukan',
      data: result
    })
  })
  .catch(err => {
    next(err)
  })
}
exports.updateBlogPost = ( req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    const err = new Error('Input Value tidak sesuai')
    err.errorStatus = 400
    err.data = errors.array()
    throw err
  }
  if(!req.file){
    const err = new Error('Image harus diUpload')
    err.errorStatus = 422
    throw err
  }
  const title = req.body.title
  const image = req.file.path
  const body = req.body.body
  const postId = req.params.postId
  
  blogPost.findById(postId)
  .then(post => {
    if(!post){
      const err = new Error('Blog post tidak ditemukan')
      err.errorStatus = 404
      throw err
    }
    post.title = title
    post.image = image
    post.body = body
    
    return post.save()
  })
  .then(result => {
    res.status(200).json({
      message: 'Update data berhasil',
      data: result
    })
  })
  .catch(err => {
    next(err)
  })
}
exports.deleteBlogPost = ( req, res, next ) => {
  const postId = req.params.postId

  blogPost.findById(postId)
  .then(post => {
    if(!post){
      const error = new Error('Blog post tidak ditemukan')
      error.errorStatus = 404
      throw error
    }
    removeImage(post.image)
    return blogPost.findByIdAndRemove(postId)

  })
  .then(result => {
    res.status(200).json({
      message: 'Hapus blog berhasil',
      data: result
    })
  })
  .catch(err => {
    next(err)
  })
}
const removeImage = (filePath) => {
  console.log('filePath', filePath)
  console.log('dir name: ', __dirname,)
// dir name:  D:\react\mern-api\images\1616725064185-stadion.jpg
  filePath = path.join(__dirname, '../../', filePath)
  fs.unlink(filePath, err => console.log(err) )

}