// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Sentryの初期化を遅延化
const initSentry = async () => {
  // ページの読み込みが完了してから初期化
  if (typeof window !== 'undefined') {
    await new Promise(resolve => setTimeout(resolve, 0));
    Sentry.init({
      dsn: "https://175eb1bf26e5490c8b670bcd2ed6f094@o4509269221507072.ingest.us.sentry.io/4509269222359040",

      // Add optional integrations for additional features
      integrations: [
        Sentry.replayIntegration(),
      ],

      // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
      tracesSampleRate: 1,

      // Define how likely Replay events are sampled.
      // This sets the sample rate to be 10%. You may want this to be 100% while
      // in development and sample at a lower rate in production
      replaysSessionSampleRate: 0.1,

      // Define how likely Replay events are sampled when an error occurs.
      replaysOnErrorSampleRate: 1.0,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,
    });
  }
};

// 初期化を開始
initSentry();

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;