<div align="center">
  <br />

![Logo](./logo.svg)

**Automate Your Way to Inbox Zero With Nylas**

A demo inbox built using the Nylas API

<br />

</div>

## Getting Started

To get started, you can run the app locally, or as Glitch app.

#### Installing Locally

**Note:** You must have node 10 or higher installed to run this app.

First, clone the repository locally:

```sh
git clone https://github.com/nylas/inbox-zero.git
```

Next, install the dependencies:

```sh
cd inbox-zero && npm install
```

#### Remix on Glitch

[Glitch](https://glitch.com/) is a community coding platform that allows you to build fast, full-stack web apps in your browser for free. Click the "Remix on Glitch" button to get started.

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/Nylas/inbox-zero?NYLAS_ID&NYLAS_SECRET)

#### Configuration

Next, you'll need to configure the app to use your Nylas Client ID and Client secret. You can find these on the [application dashboard](https://dashboard.nylas.com/applications). Don't have a Nylas account yet? [Try it free](https://dashboard.nylas.com/register)

Create a `.env` file with the following content:

```sh
export NYLAS_ID=your-client-id
export NYLAS_SECRET=your-nylas-secret
```

#### Starting your app

Finally, run `npm run local` and navigate to [http://localhost:3000](http://localhost:3000). Or if you are using glitch visit your live Glitch app. You should now see Inbox Zero!

#### Production build

To deploy Inbox Zero to production, first create a build for the app. This should most likely happen in your build step.

```sh
npm run build
```

Next, on your server, run the following to start Inbox Zero.

```sh
npm run prod
```

## Built With

- [Nylas](https://www.nylas.com/) - The Leading Platform for Email, Calendar, and Contacts
- [Next.js](https://nextjs.org/) - A React framework
- [Express.js](https://expressjs.com/) - A Node.js framework
