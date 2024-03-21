import { getRandomItemFromArray } from "../helpers"
import { generateEmailVerificationLink, sendEmail } from "./utils"

const sendContactEmail = async ({ username, email, message } = {}) => {
    const html = `
        <p>Username: ${username}</p>
        <p>Email: ${email}</p>
        <p>Message: ${message}</p>
    `

    return sendEmail({ subject: "Contact US", html })
}

const sendVerificationEmail = async ({ email, verificationToken, origin } = {}) => {
    const verificationLink = generateEmailVerificationLink({
        token: verificationToken,
        origin
    })

    const html = `
        <div dir="rtl">
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
    const stringifiedEmails = subscribers.map(subscriber => subscriber.email).join(", ")

    const html = `
        <div style="background-color:#F7F7F7;direction:rtl;text-align:right;padding:12px">
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
            </div>
        </div>
    `

    return sendEmail({ to: stringifiedEmails, subject: "Daily Quran Verse", html })
}

export { sendContactEmail, sendVerificationEmail, sendDailyEmail }
