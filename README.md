# Quran Mailer

Quran Mailer is an open-source quran mailing free service, where you can subscribe with your email address to recieve a quranic verse daily.

I've used two workflows by Pipedream, one to activate the website from sleep mode (because I'm using free plan on Render), and the second one is to automate sending mails daily.

https://pipedream.com/workflows

Also I've used Atlas cloud mongodb database to handle subscribers.

https://www.mongodb.com/atlas/database

## How to install locally

- first, make sure you have `node` installed on your device.

- then, run `npm i`, `npm install`, `yarn` or any alternative to start installing all the required packages.

- create a `.env` file samiliar to `.env.example` and fill these variables. The first variable is `PORT`, you can set it to `8080` for example. The second variable is `GMAIL_USER`, set it to your gmail, for example: `quran0mailer@gmail.com`. The third variable is `GMAIL_PASSWORD`, follow this steps to get your own: https://stackoverflow.com/questions/45478293/username-and-password-not-accepted-when-using-nodemailer. Finally, go to: https://www.mongodb.com/atlas/database. Create your database, get a `USER` and `PASSWORD` to fill the variable 4 and 5. Don't forget to set any `CRON_JOB_ROUTE` such as `/api/cron-job`.

- run `node app.js`

## How to contribute

This project is open to all types of contributing:

- you can add a new quranic verse in the `data.js` file, but first make sure it's not duplicate.

- you can recommend any new feature via the `issues` page.

- you can report any error or bug via the `issues` page.

- you can work on any issue in the `issues` page, if it has been validated.

- you can update the `README.md` file.

- you can update the code itself, by refactoring it (for example).

feel free to contribute.

Start by forking the repository to your account, clone it to your device, create a new branch for your changes, push them to your repository, and finally create a pull request.

Here is a playlist on YouTube, which can help you: [Contributing to Open Source Projects (in Arabic)](https://youtube.com/playlist?list=PLNknCqb-phEjNHT607vp-4e4o3wgK9SoN)
