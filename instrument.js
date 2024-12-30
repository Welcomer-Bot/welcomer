const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

if (!process.env.SENTRY_DSN) throw new Error("SENTRY_DSN is required");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  environment: process.env.NODE_ENV,
  release: require("./package.json").version,
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
});

