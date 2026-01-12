const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true,
        default: 0
        // 0-client, 1-admin , 2- superAdmin
    },
    // isAdmin: {
    //     type: Boolean,
    //     default: false
    // },
    isVerified: {
        type: Boolean,
        default: false
    }
},{timestamps: true})
module.exports = mongoose.model("User", userSchema)