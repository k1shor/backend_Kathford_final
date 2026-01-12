const { addProduct, getAllProducts, getProductDetails, getProductsByCategory, updateProduct, deleteProduct, getFilteredProducts } = require('../controllers/productController')
const { checkLogin, isAdmin } = require('../middlewares/authController')
const upload = require('../middlewares/fileUpload')
const { productAddRules, validate } = require('../middlewares/validationScript')

const router = require('express').Router()

router.post('/product', checkLogin, isAdmin, upload.single('product_image'), productAddRules, validate, addProduct)
router.get('/product', getAllProducts)
router.get('/product/:id', getProductDetails)
router.get('/product/category/:categoryId', getProductsByCategory)
router.put('/product/:id', checkLogin, isAdmin, upload.single('product_image'), updateProduct)
router.delete('/product/:id', checkLogin, isAdmin, deleteProduct)

router.post ('/filterproduct', getFilteredProducts)

module.exports = router