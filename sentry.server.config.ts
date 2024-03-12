// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

if (process.env.ENABLE_SENTRY === "1")
  Sentry.init({
    dsn: "https://bdf8510eca80d83217b404e75ee2f505@o4506829032652800.ingest.us.sentry.io/4506833562828800",

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    integrations: [Sentry.replayIntegration()],
  });
