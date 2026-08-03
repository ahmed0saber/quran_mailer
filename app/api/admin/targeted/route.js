import { sendBroadcastEmail } from "../../utils/email/send"

export async function POST(request) {
    try {
        const { subject, message, emails } = await request.json()

        if (!subject || !message) {
            return new Response('Missing subject or message', { status: 400 })
        }

        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return new Response('No recipients provided', { status: 400 })
        }

        // Format emails into the shape expected by sendBroadcastEmail: [{ email: "..." }]
        const subscribers = emails.map(email => ({ email }))

        await sendBroadcastEmail({ subject, message, subscribers })

        return new Response(
            JSON.stringify({ message: 'تم إرسال الرسائل بنجاح', count: subscribers.length }), 
            { status: 200, headers: { "Content-Type": "application/json" } }
        )
    } catch (error) {
        console.error("Error sending targeted message:", error)
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }
}
