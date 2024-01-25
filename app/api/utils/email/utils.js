import mailTransporter from "@/lib/nodemailer";

const sendEmail = async ({ to = process.env.GMAIL_USER, subject, html } = {}) => {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject,
        html
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

export { sendEmail }
