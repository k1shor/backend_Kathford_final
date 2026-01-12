const { processPayment, sendStripeAPI } = require('../controllers/paymentController')

const router = require('express').Router()

router.post('/processpayment', processPayment)
router.get('/getstripeapi', sendStripeAPI)

module.exports = router