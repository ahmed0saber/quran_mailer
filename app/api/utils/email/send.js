import { getRandomItemFromArray, generateHmacToken } from "../helpers"
import { generateEmailVerificationLink, sendEmail } from "./utils"

const sendContactEmail = async ({ username, email, message } = {}) => {
    const html = `
        <div style="font-family:system-ui;">
            <p>Username: ${username}</p>
            <p>Email: ${email}</p>
            <p>Message: ${message}</p>
        </div>
    `

    return sendEmail({ subject: "Contact US", html })
}

const sendVerificationEmail = async ({ email, verificationToken, origin } = {}) => {
    const verificationLink = generateEmailVerificationLink({
        token: verificationToken,
        origin
    })

    const html = `
        <div dir="rtl" style="font-family:system-ui;">
            <h1>مرحبًا بك في خدمة إرسال الآيات القرآنية يوميا!</h1>
            <p>للبدء، يرجى تأكيد عنوان بريدك الإلكتروني عن طريق النقر على الزر أدناه:</p>
            <a href="${verificationLink}">تأكيد البريد الإلكتروني</a>
            <p>إذا لم يعمل الزر، يرجى نسخ ولصق الرابط التالي في متصفحك:</p>
            <p><a href="${verificationLink}">${verificationLink}</a></p>
            <p>إذا لم تقم بالتسجيل في هذه الخدمة، يمكنك تجاهل هذا البريد الإلكتروني بأمان.</p>
        </div>
    `

    return sendEmail({ to: email, subject: "Email Verification", html })
}

const sendDailyEmail = async ({ subscribers } = {}) => {
    const verses = require("../../data/verses")
    const randomVerse = getRandomItemFromArray(verses)
    
    const shareText = `الآية ${randomVerse.ayah} من سورة ${randomVerse.sora.trim()}
%0A{ ${randomVerse.content.trim()} }%0A%0A
للمزيد قم بزيارة الرابط التالي:
%0A${encodeURI("https://quran-mailer.vercel.app")}`

    const attachments = [
        {
            filename: "whatsapp.png",
            path: "https://ahmed0saber.github.io/fonts/social-icons/whatsapp.png",
            cid: "01"
        },
        {
            filename: "telegram.png",
            path: "https://ahmed0saber.github.io/fonts/social-icons/telegram.png",
            cid: "02"
        },
        {
            filename: "twitter.png",
            path: "https://ahmed0saber.github.io/fonts/social-icons/twitter.png",
            cid: "03"
        },
    ]

    const baseUrl = process.env.APP_URL || 'https://quran-mailer.vercel.app'
    const unsubscribeLink = `${baseUrl}/unsubscribe`
    const bcc = subscribers.map(s => s.email).join(', ')

    const html = `
        <div dir="rtl" style="background-color:#F7F7F7;padding:12px;font-family:system-ui;">
            <h2
                style="color:#323232;
                width:fit-content;
                border-bottom:2px solid #323232;"
            >
                الآية ${randomVerse.ayah} من سورة ${randomVerse.sora}
            </h2>
            <div style="padding:2px;border:2px solid #28a745;border-radius:4px;">
                <p
                    style="background-color:#28a745;
                    color:#F7F7F7;
                    padding:12px;
                    font-size:18px;
                    border-radius:4px;
                    margin:0;"
                >
                    ${randomVerse.content}
                </p>
            </div>
            <p
                style="color:#323232;
                font-size:18px;
                margin:12px 0;"
            >
                شارك هذه الآية عبر المنصات التالية ولك أجرٌ على كل من يقرأها بإذن الله.
            </p>
            <div>
                <a
                    style="color:#0000;"
                    target="_blank"
                    href="https://api.whatsapp.com/send?text=${shareText}"
                    title="Share on WhatsApp"
                >
                    <img
                        src="cid:01"
                        alt="WhatsApp Icon"
                        width="48"
                        height="48"
                    />
                </a>
                <a
                    style="color:#0000;"
                    target="_blank"
                    href="https://t.me/share/url?url=${encodeURI("https://quran-mailer.vercel.app")}&text=%0A${shareText}"
                    title="Share on Telegram"
                >
                    <img
                        src="cid:02"
                        alt="Telegram Icon"
                        width="48"
                        height="48"
                    />
                </a>
                <a
                    style="color:#0000;"
                    target="_blank"
                    href="https://twitter.com/intent/tweet?text=${shareText}"
                    title="Share on Twitter"
                >
                    <img
                        src="cid:03"
                        alt="Twitter Icon"
                        width="48"
                        height="48"
                    />
                </a>
            </div>
            ${randomVerse.tafseer ?
            `<div>
                <h2
                    style="color:#323232;
                    width:fit-content;
                    border-bottom:2px solid #323232;"
                >
                    تفسير الآية
                </h2>
                <p
                    style="color:#323232;
                    font-size:18px;
                    margin:0;"
                >
                    ${randomVerse.tafseer.content}
                </p>
                <p>
                    يمكنك زيارة مصدر التفسير
                    <a href=${randomVerse.tafseer.source}>
                        من هنا
                    </a>
                </p>
            </div>`
            : ""
            }
            <div>
                <p>
                    للتواصل معنا
                    <a href="https://quran-mailer.vercel.app/contact">
                        اضغط هنا
                    </a>
                </p>
                <p>
                    للمساهمة فى إضافة الآيات أو تطوير هذه الخدمة
                    <a href="https://github.com/ahmed0saber/quran_mailer">
                        اضغط هنا
                    </a>
                </p>
                <p>
                    لا تنسى مشاركة
                    <a href="https://quran-mailer.vercel.app/subscribe">
                        هذا الرابط
                    </a>
                    مع أحبائك ليتمكنوا من الاشتراك فى هذه الخدمة
                </p>
                <p style="margin-top:24px;font-size:12px;color:#666;">
                    إذا كنت لا ترغب في تلقي هذه الرسائل بعد الآن، يمكنك 
                    <a href="${unsubscribeLink}" style="color:#666;text-decoration:underline;">
                        إلغاء الاشتراك من هنا
                    </a>.
                </p>
            </div>
        </div>
    `

    return sendEmail({ bcc, subject: "Daily Quran Verse", html, attachments })
}

const sendBroadcastEmail = async ({ subject, message, subscribers } = {}) => {
    const baseUrl = process.env.APP_URL || 'https://quran-mailer.vercel.app'
    const unsubscribeLink = `${baseUrl}/unsubscribe`
    const bcc = subscribers.map(s => s.email).join(', ')
    const formattedMessage = message.replace(/\n/g, '<br/>')

    const html = `
        <div dir="rtl" style="background-color:#F7F7F7;padding:12px;font-family:system-ui;">
            <div style="background-color:#ffffff;padding:24px;border-radius:4px;border:1px solid #e0e0e0;">
                <p
                    style="color:#323232;
                    font-size:18px;
                    margin:0;
                    line-height:1.6;"
                >
                    ${formattedMessage}
                </p>
            </div>
            <div>
                <p style="margin-top:24px;font-size:12px;color:#666;">
                    إذا كنت لا ترغب في تلقي هذه الرسائل بعد الآن، يمكنك 
                    <a href="${unsubscribeLink}" style="color:#666;text-decoration:underline;">
                        إلغاء الاشتراك من هنا
                    </a>.
                </p>
            </div>
        </div>
    `

    return sendEmail({ bcc, subject, html })
}

export { sendContactEmail, sendVerificationEmail, sendDailyEmail, sendBroadcastEmail }
