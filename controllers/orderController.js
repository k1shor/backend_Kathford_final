const OrderModel = require('../models/orderModel')
const OrderItemsModel = require('../models/orderItemsModel')

/*
orderItems: [
    {product, quantity},
    {product,quantity},
    {product,quantity}
]
user: ...
shipping_address: ...
order_status: ...
order_total
*/
// place order
exports.placeOrder = async (req, res) => {
    let orderItemsIds = await Promise.all(req.body.orderItems.map(async orderItem => {
        let orderItemToAdd = await OrderItemsModel.create({
            product: orderItem.product,
            quantity: orderItem.quantity
        })
        if (!orderItemToAdd) {
            return res.status(400).json({ error: "Failed to add product" })
        }
        return orderItemToAdd._id
    })
    )
    let individual_total = await Promise.all(
        orderItemsIds.map(async (orderItemId) => {
            let orderItem = await OrderItemsModel.findById(orderItemId).populate('product')
            return orderItem.product.product_price * orderItem.quantity
        })
    )
    let order_total = individual_total.reduce((acc, cur) => { return acc + cur })

    let orderToPlace = await OrderModel.create({
        orderItems: orderItemsIds,
        user: req.body.user,
        street: req.body.street,
        alternate_street: req.body.alternate_street,
        city: req.body.city,
        state: req.body.state,
        postal_code: req.body.postal_code,
        phone: req.body.phone,
        country: req.body.country,
        order_total: order_total
    })
    if (!orderToPlace) {
        return res.status(400).json({ error: "Failed to place order" })
    }
    res.send({ success: true, message: "Order placed successfully", orderToPlace })

}

// get all orders
exports.getAllOrders = async (req, res) => {
    let orders = await OrderModel.find().populate('user')
        .populate({ path: 'orderItems', populate: { path: "product", populate: "category" } })
    if (!orders) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(orders)
}
// get order details
exports.getOrderDetails = async (req, res) => {
    let order = await OrderModel.findById(req.params.id).populate('user')
        .populate({ path: 'orderItems', populate: { path: "product", populate: "category" } })
    if (!order) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(order)
}

// get orders by user
exports.getOrdersByUser = async (req, res) => {
    let orders = await OrderModel.find({ user: req.params.userId }).populate({ path: 'orderItems', populate: { path: "product", populate: "category" } })
    if (!orders) {
        return res.status(400).json({ error: "SOmething went wrong" })
    }
    res.send(orders)
}

// update order
exports.updateOrder = async (req, res) => {
    let orderToUpdate = await OrderModel.findByIdAndUpdate(req.params.id, {
        order_status: req.body.order_status
    }, { new: true })
    if (!orderToUpdate) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(orderToUpdate)
}

// DELETE ORDER 
exports.deleteOrder = (req, res) => {
    OrderModel.findByIdAndDelete(req.params.id)
    .then(deletedOrder=>{
        if(!deletedOrder){
            return res.status(400).json({error:"Order not found"})
        }
        deletedOrder.orderItems.map(ORDERITEM=>{
            OrderItemsModel.findByIdAndDelete(ORDERITEM)
            .then(deletedOrderItem=>{
                if(!deletedOrderItem){
                    return res.status(400).json({error:"Something went wrong"})
                }
                console.log("Order Item deleted")
            })
        })
        res.send({message: "Order deleted Successfully"})
    })
    .catch(error=>{
        return res.status(400).json({error:error.message})
    })
}