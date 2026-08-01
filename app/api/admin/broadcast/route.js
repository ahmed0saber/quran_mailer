import { getSubscribers } from "../../utils/database/subscribers"
import { sendBroadcastEmail } from "../../utils/email/send"

export async function POST(request) {
    try {
        const { subject, message } = await request.json()

        if (!subject || !message) {
            return new Response('Missing subject or message', { status: 400 })
        }

        const subscribers = await getSubscribers()

        if (subscribers.length === 0) {
            return new Response('No subscribers found', { status: 404 })
        }

        await sendBroadcastEmail({ subject, message, subscribers })

        return new Response('Broadcast sent successfully', { status: 200 })
    } catch (error) {
        console.error("Error sending broadcast:", error)
        return new Response('Internal Server Error', { status: 500 })
    }
}
