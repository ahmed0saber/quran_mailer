import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import verses from "@/data/verses"

export const maxDuration = 10

const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
})

export async function GET(request) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        })
    }

    const client = await clientPromise
    const db = client.db("myData")

    const subscribers = await db
        .collection(process.env.SUBSCRIBERS_MODEL)
        .find({ isValid: true }, { projection: { _id: 0, email: 1 } })
        .toArray()

    await sendCronJobEmails(subscribers)

    return new NextResponse(
        JSON.stringify({
            success: true
        }),
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        }
    )
}

const getRandomVerse = () => {
    const randomVerse = verses[Math.floor((Math.random() * verses.length))]
    return randomVerse
}

const sendCronJobEmails = async (subscribers) => {
    const verse = getRandomVerse()
    const stringifiedEmails = subscribers.map(subscriber => subscriber.email).join(", ")

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: stringifiedEmails,
        subject: "Quran Mailer",
        html: `
            <div style="background-color:#F7F7F7;direction:rtl;text-align:right;padding:12px">
                <h2
                    style="color:#323232;
                    width:fit-content;
                    border-bottom:2px solid #323232;"
                >
                    الآية ${verse.ayah} من سورة ${verse.sora}
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
                        ${verse.content}
                    </p>
                </div>
                ${verse.tafseer ?
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
                        ${verse.tafseer.content}
                    </p>
                    <p>
                        يمكنك زيارة مصدر التفسير
                        <a href=${verse.tafseer.source}>
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
    }

    await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
            } else {
                resolve(`Email sent to ${stringifiedEmails}: ` + info.response);
            }
        });
    });
}