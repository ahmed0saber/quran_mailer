const express = require('express')
const app = express()
const server = require("http").createServer(app)
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT
const GMAIL_USER = process.env.GMAIL_USER
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD
app.set('view engine', 'ejs')
app.use(express.static('public'))

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASSWORD
    }
})

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/subscribe', (req, res) => {
    res.render('subscribe')
})

app.get('/contact', (req, res) => {
    res.render('contact')
})

app.get('/success', (req, res) => {
    res.render('success')
})

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body
    console.log(`Received name: ${name}, email: ${email}, message: ${message}`)
    sendContactEmail(name, email, message)

    res.status(200).send({
        success: true
    })
})

app.post('/api/subscribe', (req, res) => {
    const { email } = req.body
    console.log(`Received email: ${email}`)
    addNewSubscriber(email)

    res.status(200).send({
        success: true
    })
})

app.post(process.env.CRON_JOB_ROUTE, (req, res) => {
    sendMailsToSubscribers()

    res.status(200).send({
        success: true
    })
})

app.use((req, res, next) => {
    res.render('404')
})

const Subscriber = require('./models/subscriberSchema')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGOOSE_DATABASE_URL)
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Example app listening on http://localhost:${PORT}`)
        })
    })
    .catch((err) => console.log(err))

const sendContactEmail = (name, email, message) => {
    const mailOptions = {
        from: GMAIL_USER,
        to: GMAIL_USER,
        subject: "Contact US",
        html: `
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Message: ${message}</p>
        `
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}

const addNewSubscriber = (email) => {
    const processedEmail = removeHtmlTags(email);

    Subscriber.findOne({ email: processedEmail })
        .then((subscriber) => {
            if (subscriber) {
                console.log('Subscriber already exists:', subscriber);
            } else {
                const newSubscriber = new Subscriber({
                    email: processedEmail,
                    isValid: true,
                });

                newSubscriber.save()
                    .then((result) => {
                        console.log('New subscriber added:', result);
                    })
                    .catch((err) => {
                        console.log('Error while adding new subscriber:', err);
                    });
            }
        })
        .catch((err) => {
            console.log('Error while checking subscriber existence:', err);
        });
};

const removeHtmlTags = (str) => {
    return str.replace(/<\/?\w+>/g, "")
}

const sendMailsToSubscribers = () => {
    Subscriber.find({ isValid: true })
        .then((subscribers) => {
            sendCronJobEmails(subscribers)
        })
        .catch((err) => {
            console.log(err)
        })
}

const JobScheduler = require('./utils/job-scheduler')
const mailsScheduler = new JobScheduler()

const sendCronJobEmails = (subscribers) => {
    const currentVerse = getRandomVerse()
    subscribers.forEach(subscriber => {
        mailsScheduler.enqueue(subscriber.email)
    })
    sendVerseToSubscribersInQueue(currentVerse)
}

const getRandomVerse = () => {
    const data = require('./data')
    const verses = data.verses
    const randomVerse = verses[Math.floor((Math.random() * verses.length))]

    return randomVerse
}

const updateSubscriberValidity = (email, isValid) => {
    Subscriber.findOneAndUpdate({ email: email }, { isValid: isValid })
        .then((result) => {
            console.log(`Subscriber ${email} validity updated successfully to false:`, result)
        })
        .catch((err) => {
            console.log(`Error while updating subscriber ${email}:`, err)
        })
}

const sendVerseToSubscribersInQueue = (verse) => {
    if (mailsScheduler.size() <= 0) {
        return
    }

    const processedEmail = mailsScheduler.dequeue()
    const mailOptions = {
        from: GMAIL_USER,
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
                        <a
                            style="display: inline-block;
                            margin-top: 12px;"
                            href=${verse.tafseer.source}>
                            مصدر التفسير
                        </a>
                    </div>`
                : ""
            }
                <div>
                      <p>
                         للتواصل معنا
                           <a href = "https://quran-mailer.onrender.com/contact">
                                اضغط هنا
                           </a>
                      </p>
                </div>
            </div>
        `
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            if (error.responseCode === undefined) {
                updateSubscriberValidity(processedEmail, false)
            }
        } else {
            console.log(`Email sent to ${processedEmail}: ` + info.response)
        }

        sendVerseToSubscribersInQueue(verse)
    })
}
