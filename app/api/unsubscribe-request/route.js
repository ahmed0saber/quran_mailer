import { getSubscriberByEmail } from "../utils/database/subscribers"
import { generateHmacToken } from "../utils/helpers"
import { sendEmail } from "../utils/email/utils"

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

        const subscriber = await getSubscriberByEmail(email)

        if (!subscriber || !subscriber.isValid) {
            // Return 200 even if not found to prevent email enumeration attacks
            return new Response(
                JSON.stringify({ message: "إذا كان البريد الإلكتروني مسجلاً وموثقاً، فستتلقى رسالة لإلغاء الاشتراك قريباً" }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            )
        }

        const baseUrl = process.env.APP_URL || 'https://quran-mailer.vercel.app'
        const token = generateHmacToken(email)
        const unsubscribeLink = `${baseUrl}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`

        const html = `
            <div dir="rtl" style="font-family:system-ui; background-color:#F7F7F7; padding:20px;">
                <h2 style="color:#323232;">طلب إلغاء الاشتراك</h2>
                <p style="font-size:16px; color:#333;">
                    لقد تلقينا طلباً لإلغاء اشتراكك في خدمة رسائل القرآن اليومية.
                </p>
                <p style="font-size:16px; color:#333;">
                    إذا كنت متأكداً من رغبتك في إلغاء الاشتراك وعدم تلقي أي رسائل أخرى منا، يرجى الضغط على الرابط أدناه:
                </p>
                <a href="${unsubscribeLink}" style="display:inline-block; margin:20px 0; padding:10px 20px; background-color:#dc2626; color:#fff; text-decoration:none; border-radius:5px;">
                    تأكيد إلغاء الاشتراك
                </a>
                <p style="font-size:14px; color:#666;">
                    إذا لم تقم بطلب إلغاء الاشتراك، يمكنك تجاهل هذه الرسالة بأمان وستستمر في تلقي رسائلنا.
                </p>
            </div>
        `

        await sendEmail({
            to: email,
            subject: "تأكيد إلغاء الاشتراك - خدمة رسائل القرآن",
            html
        })

        return new Response(
            JSON.stringify({ message: "تم إرسال رابط إلغاء الاشتراك إلى بريدك الإلكتروني" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        )
    } catch (error) {
        console.error("Unsubscribe request API error:", error)
        return new Response(
            JSON.stringify({ error: "حدث خطأ داخلي في الخادم" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        )
    }
}
