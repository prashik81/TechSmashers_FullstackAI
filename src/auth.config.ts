import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as { role?: string } | undefined)?.role;

      const protectedRoutes = ["/doctor", "/nurse", "/patient", "/reception"];
      const isProtected = protectedRoutes.some((p) => path.startsWith(p));

      if (!isProtected) return true;
      if (!isLoggedIn) return false;

      if (path.startsWith("/doctor") && role !== "DOCTOR") {
        return Response.redirect(new URL("/", request.url));
      }
      if (path.startsWith("/nurse") && role !== "NURSE") {
        return Response.redirect(new URL("/", request.url));
      }
      if (path.startsWith("/patient") && role !== "PATIENT") {
        return Response.redirect(new URL("/", request.url));
      }
      if (path.startsWith("/reception") && role !== "RECEPTION") {
        return Response.redirect(new URL("/", request.url));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
