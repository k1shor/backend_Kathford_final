const express = require('express')
require('dotenv').config()
require('./Database/connection')
const morgan = require('morgan')
const cors = require('cors')

const testRouter = require('./routes/testRoute')
const CategoryRouter = require('./routes/categoryRoute')
const ProductRouter = require('./routes/productRoute')
const UserRouter = require('./routes/userRoute')
const OrderRouter = require('./routes/orderRoute')
const PaymentRouter = require('./routes/paymentRoute')

const app = express()

// middleware
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

const port = process.env.PORT

app.use(testRouter)
app.use('/api',CategoryRouter)
app.use('/api',ProductRouter)
app.use('/api',UserRouter)
app.use('/api', OrderRouter)
app.use('/api', PaymentRouter)


app.use('/api/public/uploads', express.static('public/uploads'))



app.listen(port, ()=>{
    console.log(`Application started successfully at ${port}`)
})