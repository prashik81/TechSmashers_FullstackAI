import NextAuth from "next-auth";

import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/doctor/:path*", "/nurse/:path*", "/patient/:path*", "/reception/:path*"],
};
