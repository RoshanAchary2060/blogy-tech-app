const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

//! LOAD DOTENV INTO PROCESS OBJECT
dotenv.config();

const sendAccountVerificationEmail = async (to, verificationToken) => {
    try {
        //! CREATE A TRANSPORT OBJECT
        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.APP_PWD
            }
        });
        //! CREATE THE MESSAGE TO BE SENT
        const message = {
            to,
            subject: "Account Verification Token",
            html: `<p>You are receiving this email because you (or someone else) have requested to verify your account.</p>
            <p>Please click on the following link, or paste this into your browser to complete the process:</p>
            <p>https://localhost:3000/users/verify-account/${verificationToken}</p>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
        }
        //! SEND THE MAIL
        const info = await transport.sendMail(message);
        console.log('Email sent', info.messageId);
    } catch (error) {
        console.log(error);
        throw new Error('Email sending failed!')
    }
}

module.exports = sendAccountVerificationEmail;