const {Router} = require('express');
const passport = require('passport');
const UserService = require('../../services/UserService');

const router = Router();

module.exports = () => {
    router.post(
        '/login',
        passport.authenticate('local', {
            message:'Failed to login'
        }),
        async (req, res, next) => {
            try {
                if (req.body.remember) {
                    req.sessionOptions.maxAge = 24 * 60 * 60 * 1000 * 14;
                    req.session.rememberme = req.sessionOptions.maxAge;
                } else {
                    req.session.rememberme = null;
                }
                console.log(req.session);
                res.send('Login success');
            } catch (err) {
                return next(err);
            }
        }
    );

    router.get('/logout', (req, res) => {
        req.logout();
        req.session.rememberme = null;
        console.log(req);
        return res.send('Successfully logged out');
    });

    return router;
};