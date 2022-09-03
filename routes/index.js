const router = require('express').Router();
const apiRoutes = require('./api');
const loginRoutes = require('./login');
const checkTokenRoutes = require('./checkToken');

router.use('/api', apiRoutes);
router.use('/login', loginRoutes);
router.use('/checkToken', checkTokenRoutes);

router.use((req, res) => res.json({msg: 'How dare you enter the Dungeon without the Masters invitation!'}));

module.exports = router;