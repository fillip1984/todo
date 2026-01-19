/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "todo",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Nextjs("todo", {
      domain: "todo.illizen.com",
      path: "./apps/web",
      server: {
        runtime: "nodejs22.x",
      },
      environment: {
        POSTGRES_URL: process.env.POSTGRES_URL,
        POSTGRES_SCHEMA: process.env.POSTGRES_SCHEMA,
        AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
        AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
        AUTH_DISABLE_SIGN_UPS: process.env.AUTH_DISABLE_SIGN_UPS,
        AUTH_SECRET: process.env.AUTH_SECRET,
        AUTH_TRUST_HOST: "true",
        PRODUCTION_URL: process.env.PRODUCTION_URL,
      },
    });
  },
});
