import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
const nodemailer = require('nodemailer')

export const runtime = 'edge'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
})

export async function POST(req) {
    const jsonReq = await req.json()
    const { key } = jsonReq

    if (key !== process.env.CRON_JOB_KEY) {
        return new NextResponse(
            JSON.stringify({
                success: false
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        )
    }

    const client = await clientPromise
    const db = client.db("myData")

    const subscribers = await db
        .collection(process.env.SUBSCRIBERS_MODEL)
        .find({ isValid: true })
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

import verses from "@/data/verses"
import JobScheduler from "@/utils/job-scheduler"

const mailsScheduler = new JobScheduler()

const sendCronJobEmails = async (subscribers) => {
    const currentVerse = getRandomVerse()
    subscribers.forEach(subscriber => {
        mailsScheduler.enqueue(subscriber.email)
    })

    await sendVerseToSubscribersInQueue(currentVerse)
}

const getRandomVerse = () => {
    const randomVerse = verses[Math.floor((Math.random() * verses.length))]
    return randomVerse
}

const sendVerseToSubscribersInQueue = async (verse) => {
    if (mailsScheduler.size() <= 0) {
        return
    }

    const processedEmail = mailsScheduler.dequeue()
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: processedEmail,
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

    const transporterResult = await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
            } else {
                resolve(`Email sent to ${processedEmail}: ` + info.response);
            }
        });
    });
    console.log(transporterResult)

    await sendVerseToSubscribersInQueue(verse)
}