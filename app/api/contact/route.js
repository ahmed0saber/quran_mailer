import { sendContactEmail } from "../utils/email/send"

export async function POST(req) {
    const { username, email, message } = await req.json()

    await sendContactEmail({ username, email, message })

    return new Response('', { status: 200 })
}
