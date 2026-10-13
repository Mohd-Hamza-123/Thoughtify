import conf from "@/conf/conf";
import * as Sentry from "@sentry/react";

Sentry.init({
    dsn: conf.VITE_SENTRY_DSN,
    integrations: [
        Sentry.replayIntegration(),
        Sentry.browserTracingIntegration(),
    ],
    tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
    // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
    // tracePropagationTargets: [
    //     "localhost",

    // ],
    enabled: import.meta.env.PROD,
    replaysSessionSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
    replaysOnErrorSampleRate: 1.0,
    enableLogs: true,
});