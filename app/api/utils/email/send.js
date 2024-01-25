import { getRandomItemFromArray } from "../helpers"
import { sendEmail } from "./utils"

const sendContactEmail = async ({ username, email, message } = {}) => {
    const html = `
        <p>Username: ${username}</p>
        <p>Email: ${email}</p>
        <p>Message: ${message}</p>
    `

    return sendEmail({ subject: "Contact US", html })
}

const sendVerificationEmail = async ({ email, verificationLink } = {}) => {
    const html = `
        <h1>Welcome to Quran Mailer!</h1>
        <p>Hi there,</p>
        <p>To get started, please verify your email address by clicking the button below:</p>
        <a href="${verificationLink}" class="button">Verify Email</a>
        <p>If the button doesn't work, please copy and paste the following link into your browser:</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
        <p>If you did not sign up for Quran Mailer, you can safely ignore this email.</p>
    `

    return sendEmail({ to: email, subject: "Email Verification", html })
}

const sendDailyEmail = async ({ subscribers } = {}) => {
    const { verses } = require("../../data/verses")
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
                    <a href="https://quran-mailer.onrender.com/contact">
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
                    <a href="https://quran-mailer.onrender.com/subscribe">
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
