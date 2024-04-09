# Quran Mailer

Quran Mailer is a website that allows users to subscribe to a daily email and receive a random Quranic verse every day.

## Introduction

Welcome to Quran Mailer! This project aims to provide users with a daily dose of inspiration and reflection through randomly selected verses from the Quran. Users can subscribe to receive these verses via email on a daily basis.

The project is deployed on [Vercel](https://vercel.com/) and uses [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs) for website activation and email automation, along with the [Atlas Cloud MongoDB](https://www.mongodb.com/atlas/database) database for subscriber management.

## Features

- Daily email subscription service
- Random selection of Quranic verses
- Simple and user-friendly interface
- Ability to read Quran through website

## Installation

To run Quran Mailer locally or deploy it on your server, follow these steps:

1. Clone the repository:

```
git clone https://github.com/ahmed0saber/quran_mailer.git
```

2. Make sure you have [Node.js](https://nodejs.org/en/download) installed on your device.

3. Install dependencies:

```
cd quran_mailer
npm install
```

4. Configure environment variables:

Create a `.env.local` file in the root directory and set the required variables as mentioned in `.env.local.example` file, where:

- `GMAIL_USER`: Set this to your Gmail address, for instance, `quran0mailer@gmail.com`.
- `GMAIL_PASSWORD`: Obtain your Gmail app password by following these steps: [How to Get Gmail App Password](https://stackoverflow.com/questions/45478293/username-and-password-not-accepted-when-using-nodemailer).

- `MONGOOSE_DATABASE_URL`:
    - Visit [MongoDB Atlas](https://www.mongodb.com/atlas/database) and create your database.
    - Watch this video tutorial: [Setting Up MongoDB Atlas](https://www.youtube.com/watch?v=YNRjNdMTGHs) (Minute 8:37) to create a collection for subscribers.
    - Extract the `MONGOOSE_DATABASE_URL` by following the tutorial and using VS Code:
    ![screenshot for the step](<docs-images/db-creation-steps.png>)
    - Update the URL with your username, password, and database name as shown in `.env.example`.
    - Refer to this guide for further assistance: [How to Fix the "MongoServerError: Bad Authentication" Error](https://dev.to/shafia/how-to-fix-the-error-mongoservererror-bad-auth-authentication-failed-5b58).

- `SUBSCRIBERS_MODEL`: Set this to the desired subscribers collection name, such as `subscribers`.
- `DATABASE_NAME`: Set this to the database name, such as `QuranMailer`.
- `LOGGING_MODEL`: Set this to the desired logs collection name, such as `logs`.

- `CRON_SECRET`: Specify any secret key for the cron job (Vercel uses it for authorization), e.g., `123456789`.

- `ADMIN_USERNAME`: Set to any username, so you can use it to enter the dashboard, e.g., `admin`.
- `ADMIN_PASSWORD`: Set to any password, so you can use it to enter the dashboard, e.g., `admin`.

5. Start the server:

```
npm run dev
```

6. Visit http://localhost:3000 in your web browser to access Quran Mailer.

## Usage

To subscribe to the daily email service and receive Quranic verses, simply submit your email address on subscription page.

## Contributing

Contributions are welcome! If you would like to contribute to Quran Mailer, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Submit a pull request to the main repository.

If you don't have any idea about what to contribute with, here are some ideas:

- **Adding Quranic Verses**: Contribute by adding new Quranic verses to the [verses.js](app/api/data/verses.js) file. Ensure verses are not duplicated.
- **Feature Requests**: Suggest new features on the `issues` page.
- **Bug Reports**: Report errors or bugs on the `issues` page.
- **Issue Resolution**: Address validated issues from the `issues` page.
- **Code Updates and Refactoring**: Refactor code or make updates to enhance the project.
- **Documentation**: Help improve the project's documentation, including the `README.md` file.

For more detailed guidance on contributing to open source projects, check out this YouTube playlist: [Contributing to Open Source Projects (in Arabic)](https://youtube.com/playlist?list=PLNknCqb-phEjNHT607vp-4e4o3wgK9SoN).

## License

This project is licensed under the [MIT License](LICENSE.md). See the [LICENSE.md](LICENSE.md) file for more details.

## Contact

If you have any questions, suggestions, or feedback, feel free to reach out to us at [quran0mailer@gmail.com](mailto:quran0mailer@gmail.com) or [ahmed0saber33@gmail.com](mailto:ahmed0saber33@gmail.com).
