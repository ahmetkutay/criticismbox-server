const {Router} = require('express');

const {ensureLoggedIn} = require('connect-ensure-login');

const cors = require('cors');
const authRouter = require('./auth');

const router = Router();

module.exports = (params) => {
    router.get('/', (req, res) => {
        res.send('Orhun boş yapma');
    });

    router.use('/auth', authRouter(params));

    return router;
};