const {Router} = require('express');
const UserService = require('../../services/UserService');

const router = Router();

module.exports = () => {
    router.get('/verify/:userId/:token', async (req, res, next) => {
        try {
            const user = await UserService.findById(req.params.userId);
            if (!user || user.verificationToken !== req.params.token) {
                return res.send(
                    'Invalid credentials provided!');
            } else {
                user.verified = true;
                await user.save();
                return res.send(
                    'You have been verified!');
            }
        } catch (err) {
            return next(err);
        }
    });

    return router;
};