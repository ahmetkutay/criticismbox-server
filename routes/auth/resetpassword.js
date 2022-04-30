const {Router} = require('express');

const UserService = require('../../services/UserService');
const validation = require('../../middlewares/validation');

const router = Router();

module.exports = () => {
    router.post(
        '/resetpassword',
        validation.validateEmail,
        async (req, res, next) => {
            try {
                const validationErrors = validation.validationResult(req);
                const errors = [];
                if (!validationErrors.isEmpty()) {
                    validationErrors.errors.forEach((error) => {
                        res.send(error.message);
                    });
                } else {
                    const user = await UserService.findByEmail(req.body.email);
                    if (user) {
                        const resetToken = await UserService.createPasswordResetToken(
                            user.id
                        );
                    }
                }

                if (errors.length) {
                    return res.send(
                        `data ${req.body} and error ${errors}`
                    );
                }

                return res.send(
                    'If we found a matching user, you will receive a password reset link.'
                );
            } catch (err) {
                return next(err);
            }
        }
    );

    router.post(
        '/resetpassword/:userId/:resetToken',
        validation.validatePassword,
        validation.validatePasswordMatch,
        async (req, res, next) => {
            try {
                const resetToken = await UserService.verifyPasswordResetToken(
                    req.params.userId,
                    req.params.resetToken
                );
                if (!resetToken) {
                    return res.send('The provided token is invalid!');
                }
                const validationErrors = validation.validationResult(req);
                const errors = [];
                if (!validationErrors.isEmpty()) {
                    validationErrors.errors.forEach((error) => {
                        errors.push(error.param);
                        res.send(error.message)
                    });
                }

                await UserService.changePassword(req.params.userId, req.body.password);
                await UserService.deletePasswordResetToken(req.params.resetToken);
                return res.send('Password is changed successfully');
            } catch (err) {
                return next(err);
            }
        }
    );

    return router;
};