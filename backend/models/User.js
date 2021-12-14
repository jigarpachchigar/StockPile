const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    shop_name: {
        type: String,
        required: [true, 'Please add a shop name']
    },
    shop_address: {
        type: String,
        required: [true, 'Please add shop address']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: 'admin'
    },
}, {
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
})

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    console.log(enteredPassword, this.password)
    console.log(await bcrypt.compare(enteredPassword, this.password))
    return await bcrypt.compare(enteredPassword, this.password)
}

// Reverse populate with virtuals

// Employees
UserSchema.virtual('employees', {
    ref: 'Employee',
    localField: '_id',
    foreignField: 'employer',
    justOne: false
})

// Products
UserSchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'shop',
    justOne: false
})

module.exports = mongoose.model('User', UserSchema)