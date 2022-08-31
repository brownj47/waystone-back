const router = require('express').Router();

const {login}   = require('../controllers/userController')

router.post('/', login)

router.use((req, res) => res.send('How did you get here?'));

module.exports = router;