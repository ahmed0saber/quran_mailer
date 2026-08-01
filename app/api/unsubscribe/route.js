import { removeSubscriber } from "../utils/database/subscribers"
import { generateHmacToken } from "../utils/helpers"

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const token = searchParams.get('token')

    const htmlTemplate = (message) => `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>إلغاء الاشتراك</title>
            <style>
                body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #F7F7F7; margin: 0; }
                .container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>إلغاء الاشتراك</h2>
                <p>${message}</p>
                <p><a href="/" style="color: #28a745; text-decoration: none;">العودة للصفحة الرئيسية</a></p>
            </div>
        </body>
        </html>
    `

    if (!email || !token) {
        return new Response(htmlTemplate('رابط غير صالح.'), { status: 400, headers: { 'Content-Type': 'text/html' } })
    }

    const expectedToken = generateHmacToken(email)

    if (token !== expectedToken) {
        return new Response(htmlTemplate('رابط غير مصرح به.'), { status: 401, headers: { 'Content-Type': 'text/html' } })
    }

    await removeSubscriber(email)

    return new Response(htmlTemplate('لقد تم إلغاء اشتراكك بنجاح.'), { status: 200, headers: { 'Content-Type': 'text/html' } })
}
