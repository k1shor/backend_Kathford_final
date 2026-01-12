const mongoose = require('mongoose')

// mongoose.connect(process.env.DATABASE_ATLAS)
mongoose.connect(process.env.DATABASE_ATLAS)
    .then(() => {
        console.log("DATABASE CONNECTED SUCCESSFULLY")
    })
    .catch((error) => {
        console.log(error)
    })