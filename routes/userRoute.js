const { register, verifyAccount, resendVerification, getAllUsers, getUserDetails, updateUser, deleteUser, forgetPassword, resetPassword, login } = require('../controllers/userController')
const { userRegisterRules, validate } = require('../middlewares/validationScript')
const router = require('express').Router()


router.post('/register', userRegisterRules, validate, register)
router.get('/verify/:token', verifyAccount)

router.post('/resendverification', resendVerification)

router.get('/getallusers', getAllUsers)
router.get('/getuserdetails/:id', getUserDetails)

router.put('/updateuser/:id', updateUser)
router.delete('/deleteuser/:id', deleteUser)

router.post('/forgetpassword', forgetPassword)
router.post('/resetpassword/:token', resetPassword)

router.post('/login', login)


module.exports = router

// find all users
// find user details
// update user
// delete user