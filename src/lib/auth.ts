import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor } from "better-auth/plugins";

import { db } from "@/lib/db/drizzle";
import * as schema from "@/lib/db/schema";

const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    changeEmail: {
      enabled: true, // Allows users to change their email
    },
    // This extends the user object
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60,
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // every 1 day the session expiration is updated
  },
  socialProviders: {
    google: {
      enabled: true,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      clientId: process.env.GOOGLE_CLIENT_ID!,
    },
  },
  appName: "Evently",
  plugins: [
    twoFactor({
      issuer: "Evently",
    }),
  ],
});

export { auth };
