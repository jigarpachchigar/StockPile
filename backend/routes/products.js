const express = require('express')

const { getProducts, createProduct, getProduct, updateProduct, deleteProduct } = require('../controllers/products')

const router = express.Router()

const {protect, authorize} = require('../middlewares/auth')

router.route('/')
    // .get(getProducts)
    .post(protect, authorize('admin', 'employee'), createProduct)

router.route('/:id')
    .get(getProduct)
    .put(protect, authorize('admin', 'employee'), updateProduct)
    .delete(protect, authorize('admin', 'employee'), deleteProduct)

module.exports = router