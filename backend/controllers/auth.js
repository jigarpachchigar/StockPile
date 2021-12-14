const asyncHandler = require('../middlewares/async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')
const Employee = require('../models/Employee')

// @desc        Register user
// @route       POST /api/v1/auth/register
// @access      Public
exports.register = asyncHandler(async (req, res, next) => {
    const {name, email, password, shop_name, shop_address} = req.body

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        shop_name,
        shop_address
    })

    sendTokenResponse(user, 200, res)
})

// @desc        Login user
// @route       POST /api/v1/auth/login
// @access      Public
exports.login = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body

    // Validate email & password
    if(!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400))
    }

    // Check for user
    const user = await User.findOne({email}).select('+password')

    if(!user) {
        // Check for employee
        const employee = await Employee.findOne({email}).select('+password')
        if(!employee) {
            return next(new ErrorResponse('Invalid credentials', 401))
        }
        // Check if password matches
        const isMatch = await employee.matchPassword(password)
        if(!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401))
        }

        return sendTokenResponse(employee, 200, res)
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)

    if(!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    sendTokenResponse(user, 200, res)
})


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({success: true, role: user.role, token})
}

// @desc        Get current logged in user
// @route       POST /api/v1/auth/me
// @access      Private
exports.getMe = asyncHandler(async (req, res, next) => {
    let user;
    if(req.user.role === ‘employee’) {
        user = await Employee.findById(req.user.id)
    } else {
        user = await User.findById(req.user.id)
    }

    res.status(200).json({
        success: true,
        data: user
    })
})

// @desc        Update user details
// @route       PUT /api/v1/auth/updatedetails
// @access      Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        shop_name: req.body.shop_name,
        shop_address: req.body.shop_address
    }
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: user
    })
})

// @desc        Update password
// @route       PUT /api/v1/auth/updatepassword
// @access      Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')
    console.log(req.body, user)
    // Check current password
    if(!(await user.matchPassword(req.body.current_password))) {
        return next(new ErrorResponse('Password is incorrect', 401))
    }

    user.password = req.body.new_password
    await user.save()

    sendTokenResponse(user, 200, res)
})

// @desc        Get all employees associated with user
// @route       GET /api/v1/auth/employees
// @access      Private
exports.getEmployees = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate('employees')

    res.status(200).json({
        success: true,
        count: user.employees.length,
        data: user.employees
    })
})

// @desc        Get all products associated with user/shop
// @route       GET /api/v1/auth/products
// @access      Private
exports.getproducts = asyncHandler(async (req, res, next) => {
    let user

    if(req.user.role === 'employee') {
        // Find employee
        const employee = await Employee.findById(req.user.id)
        // Find employer's id
        const employerId = employee.employer.toString()
        user = await User.findById(employerId).populate('products')
    } else {
        user = await User.findById(req.user.id).populate('products')
    }

    res.status(200).json({
        success: true,
        count: user.products.length,
        data: user.products
    })
})
