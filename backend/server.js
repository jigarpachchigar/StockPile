const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const errorHandler = require('./middlewares/error')
const connectDB = require('./config/db')

// Load env vars
dotenv.config({path: './config/config.env'})

// Connect to database
connectDB()

// Route files
const auth = require('./routes/auth')
const employees = require('./routes/employees')
const products = require('./routes/products')

const app = express()

// Body parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Dev logging middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Enable CORS
app.use(cors())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/auth', auth)
app.use('/api/v1/employees', employees)
app.use('/api/v1/products', products)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
)

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)
    // Close server & exit process
    server.close(() => process.exit(1))
})