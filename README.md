# Quran Mailer

Quran Mailer is an open-source Quran mailing free service, where you can subscribe with your email address to receive a Quranic verse daily.

I've used two workflows by Pipedream, one to activate the website from sleep mode (because I'm using a free plan on Render), and the second one is to automate sending emails daily.

https://pipedream.com/workflows

Also, I've used the Atlas Cloud MongoDB database to handle subscribers.

https://www.mongodb.com/atlas/database

## How to install locally

- first, make sure you have `node` installed on your device.

- then, run `npm i`, `npm install`, `yarn`, or any alternative to start installing all the required packages.

- create a file called `.env` similar to `.env.example` and fill in these variables. The first variable is `PORT`, you can set it to `8080` for example. The second variable is `GMAIL_USER`, set it to your Gmail, for example, `quran0mailer@gmail.com`. The third variable is `GMAIL_PASSWORD`, follow these steps to get your own: https://stackoverflow.com/questions/45478293/username-and-password-not-accepted-when-using-nodemailer. Finally, go to: https://www.mongodb.com/atlas/database. Create your database, then create a collection for `subscribers` You can set them By following this video: https://www.youtube.com/watch?v=YNRjNdMTGHs to minute `8:37`, and finally get a `MONGOOSE_DATABASE_URL` after listening to the video by pressing VS Code![Alt text](<docs-images/db-creation-steps.png>) Copy the URL and update it by adding username, password, and database name similar to `.env.example` follow this https://dev.to/shafia/how-to-fix-the-error-mongoservererror-bad-auth-authentication-failed-5b58. And `SUBSCRIBERS_MODEL` is the collection name, you can set it to `subscribers` for example. Don't forget to set any `CRON_JOB_ROUTE` such as `/api/cron-job`.

- run `node app.js`


## How to contribute

This project welcomes contributions from the community. Here are several ways you can contribute:

1.  **Adding Quranic Verses**: You can contribute by adding new Quranic verses to the `data.js` file. Please ensure that the verse is not duplicated.
    
2.  **Feature Requests**: Use the `issues` page to suggest new features you'd like to see in Quran Mailer.
    
3.  **Bug Reports**: Report any errors or bugs you encounter via the `issues` page.
    
4.  **Issue Resolution**: Contribute by addressing issues listed on the `issues` page that have been validated.
    
5.  **Code Updates and Refactoring**: Feel free to refactor the code or make updates to improve the project.
    
6.  **Documentation**: Help improve the project's documentation, including the `README.md` file.
    

### To contribute, follow these steps:

1.  Fork the repository to your GitHub account.
    
2.  Clone the forked repository to your local machine.
    
3.  Create a new branch for your changes.
    
4.  Make your modifications and commit them with meaningful messages.
    
5.  Push your changes to your repository on GitHub.
    
6.  Create a pull request (PR) to the original repository.
    

For a more detailed guide on contributing to open source projects, you can refer to this [Contributing to Open Source Projects (in Arabic)](https://youtube.com/playlist?list=PLNknCqb-phEjNHT607vp-4e4o3wgK9SoN).

Your contributions are greatly appreciated, and together, we can enhance Quran Mailer for the community.
