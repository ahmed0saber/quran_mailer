import { NextResponse } from "next/server"
const nodemailer = require('nodemailer')

export const runtime = 'edge'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
})

export async function POST(req) {
    const jsonReq = await req.json()
    const {username, email, message} = jsonReq

    await sendContactEmail(username, email, message)

    return new NextResponse(
        JSON.stringify({
            success: true
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        }
    )
}

const sendContactEmail = async (username, email, message) => {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: "Contact US",
        html: `
            <p>Username: ${username}</p>
            <p>Email: ${email}</p>
            <p>Message: ${message}</p>
        `
    }

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
            } else {
                resolve('Email sent: ' + info.response);
            }
        });
    });
}