const { check, validationResult } = require('express-validator')

exports.categoryAddRules = [
    check('category_name', "Category name is required").notEmpty()
        .isLength({ min: 3 }).withMessage("Category must be at least 3 characters")
]
exports.categoryUpdateRules = [
    check('category_name').optional()
        .isLength({ min: 3 }).withMessage("Category must be at least 3 characters")
]

exports.productAddRules = [
    check('product_name', "Product name is required").notEmpty()
        .isLength({ min: 3 }).withMessage("Product name must be at least 3 characters"),
    check('product_price', "product price is required").notEmpty()
        .isNumeric().withMessage("Price must be a number"),
    check('product_description', "Product description is requried").notEmpty()
        .isLength({ min: 15 }).withMessage("Description must be at least 15 characters"),
    check('count_in_stock', "Count in stock is required").notEmpty()
        .isNumeric().withMessage("Count must be a number"),
    check('category', "Category is required").notEmpty().isMongoId().withMessage("Category must be a mongoDB Id")
]

exports.userRegisterRules = [
    check('username', "Username is requried").notEmpty()
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters")
        .not().isIn(['admin', "ADMIN", 'test', "TEST", 'user', "USER"])
        .withMessage("USERNAME not available"),
    check('email', "Email is required").notEmpty()
        .isEmail().withMessage("Email format incorrect."),
    check('password', 'Password is required').notEmpty()
        .matches(/[a-z]/).withMessage("lowercase alphabet required")
        .matches(/[A-Z]/).withMessage("uppercase alphabet required")
        .matches(/[0-9]/).withMessage("number alphabet required")
        .matches(/[!@#$%_=+]/).withMessage("special character required")
        .isLength({min:8}).withMessage("minimum 8 characters required")
        .isLength({max:30}).withMessage("maximum 30 characters required")

]

exports.validate = (req, res, next) => {
    let errors = validationResult(req)
    if (errors.isEmpty()) {
        next()
    }
    else {
        return res.status(400).json({
            error: errors.array()[0].msg
        })
    }
}