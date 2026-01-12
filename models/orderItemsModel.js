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
const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const orderItemsSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
},{timestamps: true})

module.exports = mongoose.model("OrderItems", orderItemsSchema)
