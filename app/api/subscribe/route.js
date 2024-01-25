import { NextResponse } from "next/server"
import { addSubscriber, getSubscriberByEmail } from "../utils/database/subscribers"
import { sendVerificationEmail } from "../utils/email/send"
import { generateRandomToken } from "../utils/helpers"

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
    await sendVerificationEmail({ email, verificationToken, origin: req.headers.get('origin') })
    await addSubscriber({ email, verificationToken })

    return new NextResponse(
        JSON.stringify({ success: true, message: "Verification email sent." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    )
}
