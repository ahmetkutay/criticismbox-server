const nodemailer = require("nodemailer");
require('dotenv').config();
const UserModel = require('../models/UserModel');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    }
});

class EmailService {

    static async sendEmail(user) {
        console.log(user)
        const mailOptions = {
            from: 'akkaracair@gmail.com',
            to: user.email,
            subject: 'CriticismBox Account Verification',
            text: `Hi ${user.username},
                            
We just need to verify your account before you can access Criticism Box.
                            
Verify your account: http://localhost:3000/auth/verify/${user._id}/${user.verificationToken}
                            
Thanks! – The CriticismBox team, `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}

module.exports = EmailService;