const sendEmail = async ({ to = process.env.GMAIL_USER, subject, html, attachments } = {}) => {
    const mailTransporter = require('../../../../lib/nodemailer');
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject,
        html,
        attachments
    }

    return new Promise((resolve, reject) => {
        mailTransporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
            } else {
                resolve('Email sent: ' + info.response);
            }
        });
    });
}

const generateEmailVerificationLink = ({ origin, token } = {}) => {
    const verificationLink = `${origin}/api/verify-email?token=${token}`

    return verificationLink
}

module.exports = { sendEmail, generateEmailVerificationLink }
