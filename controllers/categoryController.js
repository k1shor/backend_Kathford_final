const CategoryModel = require('../models/categoryModel')

// create category
exports.addCategory = async (request, response) => {
    let categoryExists = await CategoryModel.findOne({ category_name: request.body.category_name })

    if (categoryExists) {
        return response.status(400).json({ error: "Category already exists." })
    }

    let categoryToAdd = await CategoryModel.create({
        category_name: request.body.category_name
    })

    if (!categoryToAdd) {
        return response.status(400).json({ error: "Something went wrong" })
    }
    response.send(categoryToAdd)
}


// get all categories
exports.getAllCategories = async (req, res) => {
    let categories = await CategoryModel.find()
    if (!categories) {
        return response.status(400).json({ error: "Something went wrong" })
    }
    res.send(categories)
}

// get category details
exports.getCategoryDetails = async (req, res) => {
    let category = await CategoryModel.findById(req.params.id)
    if (!category) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(category)
}

// update category
exports.updateCategory = async (req, res) => {
    let categoryToUpdate = await CategoryModel.findByIdAndUpdate(
        req.params.id,
        {
            category_name: req.body.category_name
        },
        { new: true }
    )
    if(!categoryToUpdate){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(categoryToUpdate)
}

// delete category
// exports.deleteCategory = (req, res) => {
//     CategoryModel.findByIdAndDelete(req.params.id)
//     .then((deletedCategory)=>{
//         if(!deletedCategory){
//             return res.status(400).json({error:"Category not found"})
//         }
//         res.send({message: "Category deleted Successfully", deletedCategory})
//     })
//     .catch(error=> res.status(500).json({error: error.message}))
// }

exports.deleteCategory = async (req, res) => {
    try{
        let deletedCategory = await CategoryModel.findByIdAndDelete(req.params.id)
        if(!deletedCategory){
            return res.status(400).json({error:"Category not found"})
        }
        res.send({deletedCategory, message:"Category deleted Successfully"})
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
}

/*
request.body : data is passed using body of a form
request.params : data is passed using url/ profile/id
request.query : data is passed using url  search?q=apple

response.send(obj) : return obj , obj can be number, string, object, ...
response.json(json_obj)

status(status_code) -> optional
    default(200) -> OK
    400 -> bad request
    404 -> not found
    401 -> unauthorized error
    403 -> forbidden error
    500 -> server error
*/


/*
C Create -
        i) await Model.create(obj)
        ii) let document = new Model({obj})
            await document.save()
R Retrieve -
        Model.find() - returns all documents
        Model.find(filterObj) - returns all documents that matches filter
        Model.findById(id) - returns the document with the given id
        Model.findOne(filterObj) - returns first document that matches filter
U Update -
        Model.findByIdAndUpdate(id, {updatingObj}, {options})
D
*/