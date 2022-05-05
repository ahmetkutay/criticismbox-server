const {Router} = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const UserService = require('../../services/UserService');

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

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.EMAIL_PASSWORD,
                    }
                });

                var mailOptions = {
                    from: 'akkaracair@gmail.com',
                    to: user.email,
                    subject: 'CriticismBox Account Verification',
                    text: `Hi ${user.username},
                            
We just need to verify your email address before you can access Criticism Box.
                            
Verify your email address http://localhost:3000/auth/verify/${user._id}/${user.verificationToken}
                            
Thanks! – The CriticismBox team, `
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                return res.json({user: user});
            } catch (err) {
                return next(err);
            }
        }
    );

    return router;
};