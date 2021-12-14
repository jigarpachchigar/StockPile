const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add product name']
    },
    quantity: {
        type: Number,
        required: [true, 'Please add quantity']
    },
    price: {
        type: Number,
        required: [true, 'Please add price for single item']
    },
    stock_up: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Product', ProductSchema)