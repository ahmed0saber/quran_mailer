import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { randomBytes } from 'crypto'
import mailTransporter from "@/lib/nodemailer"

export async function POST(req) {
    const jsonReq = await req.json()
    const { email } = jsonReq

    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME)

    const subscriber = await db
        .collection(process.env.SUBSCRIBERS_MODEL)
        .findOne({ email })

    if (subscriber) {
        return new NextResponse(
            JSON.stringify({ success: false, message: "Email is already subscribed or has recieved verification link." }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        )
    }

    const verificationToken = randomBytes(16).toString('hex')
    const verificationLink = generateEmailVerificationLink({
        headers: req.headers,
        token: verificationToken
    })

    await sendVerificationEmail(email, verificationLink)

    await db.collection(process.env.SUBSCRIBERS_MODEL).insertOne({
        email,
        verificationToken,
        isValid: false
    })

    return new NextResponse(
        JSON.stringify({ success: true, message: "Verification email sent." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    )
}

const generateEmailVerificationLink = ({ headers, token } = {}) => {
    const host = headers.host || 'localhost:3000'
    const protocol = headers['x-forwarded-proto'] || 'http'
    const verificationLink = `${protocol}://${host}/api/verify-email?token=${token}`

    return verificationLink
}

const sendVerificationEmail = async (email, verificationLink) => {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Email Verification",
        html: `
            <h1>Welcome to Quran Mailer!</h1>
            <p>Hi there,</p>
            <p>To get started, please verify your email address by clicking the button below:</p>
            <a href="${verificationLink}" class="button">Verify Email</a>
            <p>If the button doesn't work, please copy and paste the following link into your browser:</p>
            <p><a href="${verificationLink}">${verificationLink}</a></p>
            <p>If you did not sign up for Quran Mailer, you can safely ignore this email.</p>
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
