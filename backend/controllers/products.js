const asyncHandler = require('../middlewares/async')
const ErrorResponse = require('../utils/errorResponse')
const Product = require('../models/Product')

// @desc        Get all products
// @route       GET /api/v1/products
// @access      Public
// exports.getProducts = asyncHandler(async (req, res, next) => {
//     const products = await Product.find().populate({
//         path: 'shop',
//         select: 'shop_name shop_address',
//     })

//     res.status(200).json({ success: true, count: products.length, data: products })
// })

// @desc        Get single product
// @route       GET /api/v1/products/:id
// @access      Public
exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate({
        path: 'shop',
        select: 'shop_name shop_address',
    })

    if (!product) {
        return next(new ErrorResponse(`Resource not found with the id of ${req.params.id}!`, 404))
    }

    res.status(200).json({ success: true, data: product })
})

// @desc        Create new product
// @route       POST /api/v1/products
// @access      Private
exports.createProduct = asyncHandler(async (req, res, next) => {
    // Add owner to req.body
    let shop
    if(req.user.role === 'employee') {
        shop = req.user.employer
    } shop = req.user.id

    req.body.shop = shop

    const product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        msg: product
    })
})

// @desc        Update product
// @route       PUT /api/v1/products/:id
// @access      Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!product) {
        return next(new ErrorResponse(`Resource not found with the id of ${req.params.id}!`, 404))
    }
    res.status(200).json({ success: true, data: product })
})

// @desc        Delete product
// @route       DELETE /api/v1/products/:id
// @access      Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
        return next(new ErrorResponse(`Resource not found with the id of ${req.params.id}!`, 404))
    }
    res.status(200).json({ success: true, data: {} })
})