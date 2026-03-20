import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // API routes: let them through — they have their own requireAuth() check
        // that returns proper 401 JSON responses
        if (req.nextUrl.pathname.startsWith("/api/")) {
          return true;
        }
        // Page routes: require auth via middleware (redirects to /login)
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/mandala",
    "/rishi",
    "/antahkarana",
    "/nada",
    "/sabha",
    "/discovery",
    "/yajna",
  ],
};
