import { NextResponse } from "next/server"
import { addSubscriber, getSubscriberByEmail } from "../utils/database/subscribers"
import { sendVerificationEmail } from "../utils/email/send"
import { generateEmailVerificationLink, generateRandomToken } from "./utils"

export async function POST(req) {
    const { email } = await req.json()

    const subscriber = await getSubscriberByEmail(email)
    if (subscriber) {
        return new NextResponse(
            JSON.stringify({ success: false, message: "Email is already subscribed or has recieved verification link." }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        )
    }

    const verificationToken = generateRandomToken()
    const verificationLink = generateEmailVerificationLink({
        headers: req.headers,
        token: verificationToken
    })

    await sendVerificationEmail({ email, verificationLink })
    await addSubscriber({ email, verificationToken })

    return new NextResponse(
        JSON.stringify({ success: true, message: "Verification email sent." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    )
}
