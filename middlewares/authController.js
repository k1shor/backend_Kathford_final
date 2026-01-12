const jwt = require('jsonwebtoken')
const UserModel = require('../models/userModel')

exports.checkLogin = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: "User not logged in." })
    }
    let token = req.headers.authorization.toString().split(" ")[1]
    if (!token) {
        return res.status(401).json({ token: "TOKEN ERROR" })
    }
    let decoded = jwt.decode(token, process.env.JWT_SECRET)
    if (!decoded) {
        return res.status(401).json({ error: "Invalid token" })
    }
    let user = await UserModel.findById(decoded._id)
    if (!user) {
        return res.status(401).json({ error: "User not found" })
    }
    req.user = user
    next()
}

exports.isAdmin = async (req, res, next) => {
    // if (!req.headers.authorization) {
    //     return res.status(401).json({ error: "User not logged in." })
    // }
    // let token = req.headers.authorization.toString().split(" ")[1]
    // if (!token) {
    //     return res.status(401).json({ token: "TOKEN ERROR" })
    // }
    // let decoded = jwt.decode(token, process.env.JWT_SECRET)
    // if (!decoded) {
    //     return res.status(401).json({ error: "Invalid token" })
    // }
    // let user = await UserModel.findById(decoded._id)
    // if (!user) {
    //     return res.status(401).json({ error: "User not found" })
    // }
    // if (user.role == 1) {
    //     return res.status(403).json({error:"User not admin"})
    // }
    if (req.user && req.user.role == 1)
        next()
    else {
        return res.status(403).json({ error: "USER NOT ADMIN" })
    }
}