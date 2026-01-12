const { placeOrder, getAllOrders, getOrderDetails, getOrdersByUser, updateOrder, deleteOrder } = require('../controllers/orderController')
const router = require('express').Router()

router.post('/placeorder', placeOrder)
router.get('/getallorders', getAllOrders)
router.get('/getorderdetails/:id', getOrderDetails)
router.get('/getordersbyuser/:userId', getOrdersByUser)
router.put('/updateorder/:id', updateOrder)
router.delete('/deleteorder/:id', deleteOrder)

module.exports = router