const {Router} = require('express');
const UserService = require('../../services/UserService');

const router = Router();

module.exports = () => {
    router.get('/userlist', async (req, res, next) => {
        try {
            const users = await UserService.getList();
            if (users && users.length && users.length > 0) {
                const userList = await Promise.all(
                    users.map(async (user) => {
                        const userJson = user.toJSON();
                        const resetToken = await UserService.getResetToken(user.id);
                        if (resetToken && resetToken.token) {
                            userJson.resetToken = resetToken.token;
                        }
                        return userJson;
                    })
                );

                return res.json(
                    {userList: userList}
                );
            } else {
                return res.send('No user found')
            }
        } catch (err) {
            return next(err);
        }
    });
    return router;
};