const ProductModel = require('../models/productModel')
const fs = require('fs')

// add product
exports.addProduct = async (req, res) => {
    console.log(req.body, req.file)
    if (!req.file) {
        return res.status(400).json({ error: "File is required" })
    }
    let newProduct = await ProductModel.create({
        product_name: req.body.product_name,
        product_description: req.body.product_description,
        product_price: req.body.product_price,
        product_image: req.file?.path,
        count_in_stock: req.body.count_in_stock,
        category: req.body.category
    })
    if (!newProduct) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(newProduct)
}

// to list all products
exports.getAllProducts = async (req, res) => {
    let products = await ProductModel.find().populate('category')
    if (!products) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(products)
}



// to get product details
exports.getProductDetails = async (req, res) => {
    let product = await ProductModel.findById(req.params.id).populate('category')
    if (!product) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(product)
}

// to get products of a particular category
exports.getProductsByCategory = async (req, res) => {
    let products = await ProductModel.find({ category: req.params.categoryId })
    if (!products) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(products)
}

// to update product
exports.updateProduct = async (req, res) => {
    console.log(req.body)
    let productToUpdate = await ProductModel.findById(req.params.id)
    if (!productToUpdate) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    if (req.file) {
        if (fs.existsSync(productToUpdate.product_image)) {
            fs.unlinkSync(productToUpdate.product_image)
        }
        productToUpdate.product_image = req.file.path
    }

    let { product_name, product_price, product_description, count_in_stock, category } = req.body

    productToUpdate.product_name = product_name ? product_name : productToUpdate.product_name

    productToUpdate.product_price = product_price ? product_price : productToUpdate.product_price

    productToUpdate.product_description = product_description ? product_description : productToUpdate.product_description

    productToUpdate.count_in_stock = count_in_stock ? count_in_stock : productToUpdate.count_in_stock

    productToUpdate.category = category ? category : productToUpdate.category

    productToUpdate = await productToUpdate.save()

    if (!productToUpdate) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(productToUpdate)
}

// delete product
exports.deleteProduct = (req, res) => {
    ProductModel.findByIdAndDelete(req.params.id)
        .then((deletedProduct) => {
            if (!deletedProduct) {
                return res.status(400).json({ error: "Product not found" })
            }
            if (fs.existsSync(deletedProduct.product_image)) {
                fs.unlinkSync(deletedProduct.product_image)
            }
            res.send({ deletedProduct, message: "Product deleted successfully" })
        })
        .catch((error) => {
            res.status.json({ error: error.message })
        })
}

// get filtered products
// filter - {category: ['category_id'], product_price: [0,999]}
exports.getFilteredProducts = async (req, res) => {
    let filter = {}
    for (var key in req.body) {
        if (req.body[key].length > 0) {
            if (key == 'category') {
                filter[key] = req.body[key]
            }
            else {
                filter[key] = {
                    '$gte': req.body[key][0],
                    '$lte': req.body[key][1]
                }
            }
        }
    }
    let products = await ProductModel.find(filter).populate('category')
    if (!products) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(products)

}