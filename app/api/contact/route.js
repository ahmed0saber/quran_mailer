import { NextResponse } from "next/server"
import { sendContactEmail } from "../utils/email/send"

export async function POST(req) {
    const { username, email, message } = await req.json()

    await sendContactEmail({ username, email, message })

    return new NextResponse(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    )
}
