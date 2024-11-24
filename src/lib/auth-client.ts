import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  twoFactorClient,
} from "better-auth/client/plugins";

import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), twoFactorClient()],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  twoFactor,
  updateUser,
  deleteUser,
  changeEmail,
  changePassword,
  totp,
} = authClient;
