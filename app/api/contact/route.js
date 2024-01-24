import { NextResponse } from "next/server"
import mailTransporter from "@/lib/nodemailer"

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
        mailTransporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
            } else {
                resolve('Email sent: ' + info.response);
            }
        });
    });
}