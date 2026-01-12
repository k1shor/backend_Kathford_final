const UserModel = require('../models/userModel')
const TokenModel = require('../models/tokenModel')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { emailSender } = require('../middlewares/emailSender')
const saltRound = 10
const jwt = require('jsonwebtoken')


// register
exports.register = async (req, res) => {
    // destructuring req.body
    const { username, email, password } = req.body

    // check if username is available or not 
    let userNameExists = await UserModel.findOne({ username })
    if (userNameExists) {
        return res.status(400).json({ error: "Username not available" })
    }

    // check if email is already registered
    let emailExists = await UserModel.findOne({ email })
    if (emailExists) {
        return res.status(400).json({ error: "Email already registered." })
    }

    // encrypt password
    let salt = await bcrypt.genSalt(saltRound)
    console.log(salt)
    let hashpassword = await bcrypt.hash(password, salt)

    // add user
    let userToRegister = await UserModel.create({
        username,
        email,
        password: hashpassword
    })
    if (!userToRegister) {
        return res.status(400).json({ error: "Failed to register" })
    }
    // generate verification token 
    const tokenObj = await TokenModel.create({
        token: crypto.randomBytes(16).toString('hex'),
        user: userToRegister._id
    })
    console.log(tokenObj)
    // and send it in email
    // const URL = `http://localhost:5000/api/verify/${tokenObj.token}`
    const URL = `${process.env.FRONTEND_URL}/verify/${tokenObj.token}`

    emailSender({
        from: 'info@indexithub.com',
        to: email,
        subject: 'Verification Email',
        text: `Click on the following link to verify your account. ${URL}`,
        html: `<a href='${URL}'><button>Verify Now</button></a>`
    })

    // send message to user
    res.send({
        user: userToRegister,
        message: "User registered successfully",
        success: true
    })

}

// verify account
exports.verifyAccount = async (req, res) => {
    // check if token is valid or not
    let tokenObj = await TokenModel.findOne({ token: req.params.token })
    if (!tokenObj) {
        return res.status(400).json({ error: "Invalid token or token may have expired" })
    }
    // find user associated with token
    let userToVerify = await UserModel.findById(tokenObj.user)
    if (!userToVerify) {
        return res.status(400).json({ error: "User not found." })
    }
    // check if user is already verified
    if (userToVerify.isVerified) {
        return res.status(400).json({ error: "User already verified" })
    }
    // verify user and save
    userToVerify.isVerified = true
    userToVerify = await userToVerify.save()
    if (!userToVerify) {
        return res.status(400).json({ error: "Failed to verify" })
    }
    // send message to user
    res.send({ message: "User verified successfully." })
}

// resend verification
exports.resendVerification = async (req, res) => {
    // check if email is registered or not
    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "User/Email not registered" })
    }

    // check if user is already verified
    if (user.isVerified) {
        return res.status(400).json({ error: "User already verified" })
    }

    // generate verification token
    let tokenObj = await TokenModel.create({
        token: crypto.randomBytes(24).toString('hex'),
        user: user._id
    })
    if (!tokenObj) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    // send token in email
    const URL = `${process.env.FRONTEND_URL}/verify/${tokenObj.token}`
    emailSender({
        from: "noreply@something.com",
        to: user.email,
        subject: "Verification Email",
        text: `Click on the following link to verify your account. ${URL}`,
        html: `<a href='${URL}'><button>Verify Account</button></a>`
    })
    // send message to user
    res.send({ message: "Email verification link has been sent to your email" })
}

// get all users
exports.getAllUsers = async (req, res) => {
    let users = await UserModel.find()
    if (!users) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(users)
}

// get user Details
exports.getUserDetails = async (req, res) => {
    let user = await UserModel.findById(req.params.id)
    if (!user) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(user)
}

// update user
exports.updateUser = async (req, res) => {
    let user = await UserModel.findByIdAndUpdate(req.params.id, {
        role: req.body.role,
        isVerified: req.body.verify
    }, { new: true })
    if (!user) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(user)
}

exports.deleteUser = async (req, res) => {
    let deletedUser = await UserModel.findByIdAndDelete(req.params.id)
    if (!deletedUser) {
        return res.status(400).json({ error: "User not found" })
    }
    res.send({
        message: "User deleted Successfully",
        deletedUser,
        success: true
    })
}

//forget password
exports.forgetPassword = async (req, res) => {
    // check if email is registered or not
    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "Email not registered" })
    }
    // generate token to reset password
    let tokenObj = await TokenModel.create({
        token: crypto.randomBytes(24).toString('hex'),
        user: user._id
    })
    if (!tokenObj) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    // send token in email
    const URL = `${process.env.FRONTEND_URL}/resetpassword/${tokenObj.token}`
    emailSender({
        from: 'no-reply@something.com',
        to: req.body.email,
        subject: "Password Reset Email",
        text: "Click on the following link to reset your password",
        html: `<a href='${URL}'><button>Reset Password</button></a>`
    })
    // send message to user
    res.send({ message: "Password reset link has been sent to your email." })
}

// reset password
exports.resetPassword = async (req, res) => {
    // check if token is valid or not
    let tokenObj = await TokenModel.findOne({ token: req.params.token })
    if (!tokenObj) {
        return res.status(400).json({ error: "Invalid token or Token may have expired" })
    }
    // find user
    let user = await UserModel.findById(tokenObj.user)
    if (!user) {
        return res.status(400).json({ error: "User not found." })
    }
    // encrypt password
    let salt = await bcrypt.genSalt(saltRound)
    let hashedPassword = await bcrypt.hash(req.body.password, salt)
    // update password and save user
    user.password = hashedPassword
    user = await user.save()
    if (!user) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    // send message to user
    res.send({ message: "Password reset successful" })
}

// login,
exports.login = async (req, res) => {
    const { email, password } = req.body
    // check if email is registered or not
    let user = await UserModel.findOne({ email })
    if (!user) {
        return res.status(400).json({ error: "Email not registered" })
    }
    // check if password is correct
    let passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        return res.status(400).json({ error: "Email and password do not match" })
    }
    // check if user is verified or not
    if (!user.isVerified) {
        return res.status(400).json({ error: "User not verified." })
    }
    // generate login token using jwt
    let token = jwt.sign({
        username: user.username,
        email: email,
        role: user.role,
        _id: user._id
    }, process.env.JWT_SECRET, { expiresIn: '24h' })

    // send message/login token to frontend
    res.send({ token, message: "Login successful", 
        user: {_id: user._id, username: user.username, role: user.role, email: user.email} })
}




// authentication and authorization
// install jsonwebtoken

// validation - express-validator