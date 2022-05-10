const {Router} = require('express');

const UserService = require('../../services/UserService');
const passport = require("passport");

const router = Router();

module.exports = () => {
    router.get('/', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    router.get('/callback', passport.authenticate('google'),
        async (req, res, next) => {
            try {
                const errors = [];
                const existingEmail = await UserService.findByEmail(req.user._json.email);
                const existingUsername = await UserService.findByUsername(req.user.displayName);

                if (existingEmail || existingUsername) {
                    errors.push('email');
                    errors.push('username');
                    res.send('The given email address or the username exist already!');
                }


                if (errors.length) {
                    return res.json({
                        data: req.user, errors,
                    });
                }
                const tempOAuthProfile = {
                    provider: req.user.provider, profileId: req.user.id,
                }

                const user = await UserService.createGoogleUser(req.user.displayName, req.user._json.email, tempOAuthProfile);

                return res.send({googleUsers: user});
            } catch (err) {
                return next(err);
            }
        });

    return router;
};