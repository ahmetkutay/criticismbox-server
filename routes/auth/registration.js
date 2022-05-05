const {Router} = require('express');

const UserService = require('../../services/UserService');
const EmailService = require('../../services/EmailService');

const validation = require('../../middlewares/validation');

const router = Router();

module.exports = () => {
    router.post(
        '/register',
        validation.validateUsername,
        validation.validateEmail,
        validation.validatePassword,
        validation.validatePasswordMatch,
        async (req, res, next) => {
            try {
                const validationErrors = validation.validationResult(req);
                const errors = [];
                if (!validationErrors.isEmpty()) {
                    validationErrors.errors.forEach((error) => {
                        errors.push(error.param);
                        res.send(
                            error.msg
                        );
                    });
                } else {
                    const existingEmail = await UserService.findByEmail(req.body.email);
                    const existingUsername = await UserService.findByUsername(
                        req.body.username
                    );

                    if (existingEmail || existingUsername) {
                        res.send(
                            'The given email address or the username exist already!'
                        );
                    }
                }

                if (errors.length) {
                    return res.send(`data: ${req.body} and error is ${errors}`
                    );
                }

                const user = await UserService.createUser(
                    req.body.username,
                    req.body.email,
                    req.body.password
                );

                await EmailService.sendEmail(user);

                return res.json({user: user});
            } catch (err) {
                return next(err);
            }
        }
    );

    return router;
};