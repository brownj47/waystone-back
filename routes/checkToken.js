
const router = require('express').Router();

const {checkToken}   = require('../controllers/userController')

router.get('/', checkToken)


module.exports = router;