# Quran Mailer

Quran Mailer is an open-source Quran mailing free service, where you can subscribe with your email address to receive a Quranic verse daily.


## Contributing to Quran Mailer

Thank you for considering contributing to Quran Mailer! Your help is greatly appreciated. Here's how you can get involved:



The project uses Pipedream workflows for website activation and email automation, along with the Atlas Cloud MongoDB database for subscriber management.

- Pipedream Workflows: [Pipedream Workflows](https://pipedream.com/workflows)
- MongoDB Atlas: [Atlas Cloud MongoDB](https://www.mongodb.com/atlas/database)

## Local Installation

To set up Quran Mailer locally, follow these steps:

1. Make sure you have `node` installed on your device.

2. Run `npm i`, `npm install`, `yarn`, or any alternative to install the required packages.

3. Create a `.env` file similar to `.env.example` and fill in the necessary variables:
   - `PORT`: Set this to your desired port number, e.g., `8080`.
   - `GMAIL_USER`: Set this to your Gmail address, for instance, `quran0mailer@gmail.com`.
   - `GMAIL_PASSWORD`: Obtain your Gmail app password by following these steps: [How to Get Gmail App Password](https://stackoverflow.com/questions/45478293/username-and-password-not-accepted-when-using-nodemailer).
   - MongoDB Configuration:
     - Visit [MongoDB Atlas](https://www.mongodb.com/atlas/database) and create your database.
     - Watch this video tutorial: [Setting Up MongoDB Atlas](https://www.youtube.com/watch?v=YNRjNdMTGHs) (Minute 8:37) to create a collection for subscribers.
     - Extract the `MONGOOSE_DATABASE_URL` by following the tutorial and using VS Code![Alt text](<docs-images/db-creation-steps.png>).
     - Update the URL with your username, password, and database name as shown in `.env.example`.
     - Refer to this guide for further assistance: [How to Fix the "MongoServerError: Bad Authentication" Error](https://dev.to/shafia/how-to-fix-the-error-mongoservererror-bad-auth-authentication-failed-5b58).
   - `SUBSCRIBERS_MODEL`: Set this to the desired collection name, such as `subscribers`.
   - `CRON_JOB_ROUTE`: Specify any desired route for the cron job, e.g., `/api/cron-job`.
   
4. Run `node app.js` to start the application.

## Contribution Guidelines

You can contribute to Quran Mailer in various ways:

- **Adding Quranic Verses**: Contribute by adding new Quranic verses to the `data.js` file. Ensure verses are not duplicated.
- **Feature Requests**: Suggest new features on the `issues` page.
- **Bug Reports**: Report errors or bugs on the `issues` page.
- **Issue Resolution**: Address validated issues from the `issues` page.
- **Code Updates and Refactoring**: Refactor code or make updates to enhance the project.
- **Documentation**: Help improve the project's documentation, including the `README.md` file.

## Contribution Steps

1. Fork the repository to your GitHub account.
2. Clone the forked repository to your local machine.
3. Create a new branch for your changes.
4. Make your modifications and commit with meaningful messages.
5. Push your changes to your GitHub repository.
6. Create a pull request (PR) to the original repository.

For more detailed guidance on contributing to open source projects, check out [Contributing to Open Source Projects (in Arabic)](https://youtube.com/playlist?list=PLNknCqb-phEjNHT607vp-4e4o3wgK9SoN).

Your contributions help enhance Quran Mailer for the community. Thank you for being part of this project!
