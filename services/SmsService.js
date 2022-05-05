const Vonage = require('@vonage/server-sdk')
require('dotenv').config();

const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET_KEY
})

class SmsService {

    static async sendSms(user) {
        const from = "CrıtıcısmBox";
        const to = user.mobileNumber;
        const text = `CriticismBox hesabiniz icin dogrulama kodunuz: ${user.verificationToken}`

        vonage.message.sendSms(from, to, text, (err, responseData) => {
            if (err) {
                console.log(err);
            } else {
                if(responseData.messages[0]['status'] === "0") {
                    console.log("Message sent successfully.");
                } else {
                    console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                }
            }
        })
    }
}

module.exports = SmsService;