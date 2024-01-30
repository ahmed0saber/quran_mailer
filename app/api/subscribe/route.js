import { addSubscriber, getSubscriberByEmail } from "../utils/database/subscribers"
import { sendVerificationEmail } from "../utils/email/send"
import { generateRandomToken } from "../utils/helpers"

export async function POST(req) {
    const { email } = await req.json()

    const subscriber = await getSubscriberByEmail(email)
    if (subscriber) {
        return new Response('', { status: 200 })
    }

    const verificationToken = generateRandomToken()
    await sendVerificationEmail({ email, verificationToken, origin: req.headers.get('origin') })
    await addSubscriber({ email, verificationToken })

    return new Response('', { status: 200 })
}
