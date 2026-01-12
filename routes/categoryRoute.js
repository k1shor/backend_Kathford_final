const express = require('express')
const { addCategory, getAllCategories, getCategoryDetails, updateCategory, deleteCategory } = require('../controllers/categoryController')
const { checkLogin, isAdmin } = require('../middlewares/authController')
const { categoryAddRules, validate, categoryUpdateRules } = require('../middlewares/validationScript')
const router = express.Router()

router.post('/addcategory', checkLogin, isAdmin, categoryAddRules, validate, addCategory)
router.get('/getallcategories', getAllCategories)
router.get('/getcategorydetails/:id', getCategoryDetails)
router.put('/updatecategory/:id', checkLogin, isAdmin, categoryUpdateRules, validate, updateCategory)
router.delete('/deletecategory/:id',checkLogin, isAdmin, deleteCategory)

// router.post('/', addCategory)
// router.get('/', getAllCategories)
// router.get('/:id', getCategoryDetails)
// router.put('/:id', updateCategory)
// router.delete('/:id', deleteCategory)

module.exports = router