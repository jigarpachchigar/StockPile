const express = require('express')

const {register, login, getMe, getEmployees, updateDetails, updatePassword, getproducts} = require('../controllers/auth')

const router = express.Router()

const {protect, authorize} = require('../middlewares/auth')


router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.put('/updatedetails', protect, authorize('admin'), updateDetails)
router.put('/updatepassword', protect, authorize('admin'), updatePassword)
router.get('/employees', protect, authorize('admin'), getEmployees)
router.get('/products', protect, getproducts)

module.exports = router