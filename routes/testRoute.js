const express = require('express')
const { hello2, hello } = require('../controllers/testcontroller')
const router = express.Router()

router.get('/', hello)
router.get('/hello', hello2)

module.exports = router