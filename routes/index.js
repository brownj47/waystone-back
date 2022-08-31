const router = require('express').Router();
const apiRoutes = require('./api');
const loginRoutes = require('./login');

router.use('/api', apiRoutes);
router.use('/login', loginRoutes);

router.use((req, res) => res.send('How did you get here?'));

module.exports = router;