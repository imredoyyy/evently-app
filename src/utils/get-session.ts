import { headers } from "next/headers";
import { cache } from "react";

import { auth } from "@/lib/auth";

export const getSession = cache(async () => {
  const headersList = await headers();
  return auth.api.getSession({ headers: headersList });
});
