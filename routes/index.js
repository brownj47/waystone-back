const router = require('express').Router();
const apiRoutes = require('./api');
const loginRoutes = require('./login');

router.use('/api', apiRoutes);
router.use('/login', loginRoutes);

router.use((req, res) => res.send('How dare you enter the Dungeon without the Masters invitation!'));

module.exports = router;