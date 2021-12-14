const express = require('express')

const { getEmployees, createEmployee, getEmployee, updateEmployee, deleteEmployee } = require('../controllers/employees')

const router = express.Router()

const {protect, authorize} = require('../middlewares/auth')

router.route('/')
    // .get(getEmployees)
    .post(protect, authorize('admin'), createEmployee)

router.route('/:id')
    .get(protect, authorize('admin'), getEmployee)
    .put(protect, authorize('admin'), updateEmployee)
    .delete(protect, authorize('admin'), deleteEmployee)

module.exports = router