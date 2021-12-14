const asyncHandler = require('../middlewares/async')
const ErrorResponse = require('../utils/errorResponse')
const Employee = require('../models/Employee')

// @desc        Get all employees
// @route       GET /api/v1/employees
// @access      Public
// exports.getEmployees = asyncHandler(async (req, res, next) => {
//     const employees = await Employee.find().populate({
//         path: 'employer',
//         select: 'shop_name shop_address'
//     })

//     res.status(200).json({ success: true, count: employees.length, data: employees })
// })

// @desc        Get single employee
// @route       GET /api/v1/employees/:id
// @access      Public
exports.getEmployee = asyncHandler(async (req, res, next) => {
    const employee = await Employee.findById(req.params.id)

    if (!employee) {
        return next(new ErrorResponse(`Resource not found with the id of ${req.params.id}!`, 404))
    }

    res.status(200).json({ success: true, data: employee })
})

// @desc        Create new employee
// @route       POST /api/v1/employees
// @access      Private
exports.createEmployee = asyncHandler(async (req, res, next) => {
    // Add employer to req.body
    req.body.employer = req.user.id

    const employee = await Employee.create(req.body)

    res.status(201).json({
        success: true,
        msg: employee
    })
})

// @desc        Update employee
// @route       PUT /api/v1/employees/:id
// @access      Private
exports.updateEmployee = asyncHandler(async (req, res, next) => {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!employee) {
        return next(new ErrorResponse(`Resource not found with the id of ${req.params.id}!`, 404))
    }
    res.status(200).json({ success: true, data: employee })
})

// @desc        Delete employee
// @route       DELETE /api/v1/employees/:id
// @access      Private
exports.deleteEmployee = asyncHandler(async (req, res, next) => {
    const employee = await Employee.findByIdAndDelete(req.params.id)

    if (!employee) {
        return next(new ErrorResponse(`Resource not found with the id of ${req.params.id}!`, 404))
    }
    res.status(200).json({ success: true, data: {} })
})