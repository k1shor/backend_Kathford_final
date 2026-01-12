const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const orderSchema = new mongoose.Schema({
    orderItems: [{
        type: ObjectId, 
        ref: "OrderItems"
    }],
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    street: {
        type: String,
        required: true
    },
    alternate_street:{
        type: String
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    postal_code: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    order_status: {
        required: true,
        type: String,
        default: "PENDING"
    },
    order_total: {
        type: Number,
        required: true
    }
},{timestamps: true})
module.exports = mongoose.model("Order", orderSchema)