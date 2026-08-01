import { verifySubscriberByEmail } from "../../../utils/database/subscribers"

export const dynamic = 'force-dynamic'

export async function POST(req) {
    try {
        const { email } = await req.json()

        if (!email) {
            return new Response(
                JSON.stringify({ error: "البريد الإلكتروني مطلوب" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            )
        }

        const result = await verifySubscriberByEmail(email)

        if (!result) {
            return new Response(
                JSON.stringify({ error: "لم يتم العثور على المستخدم أو أنه مُوثق بالفعل" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            )
        }

        return new Response(
            JSON.stringify({ message: "تم توثيق المستخدم بنجاح" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        )
    } catch (error) {
        console.error("Verify user API error:", error)
        return new Response('Internal Server Error', { status: 500 })
    }
}
