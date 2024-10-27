import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl; // Get the current request path
  console.log("🚀 ~ middleware ~ pathname:", pathname);

  // Skip middleware for the /login route
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // Check for the auth token in cookies
  const token = req.cookies.get("authToken");
  console.log("🚀 ~ middleware ~ token:", token);

  // Redirect to /login if the token is not found
  if (!token) {
    console.log("🚀 ~ middleware ~ token:", token);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/weekly-schedule", req.url));
  }

  // Continue to the requested page if the token is present
  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: [
    "/",
    "/attendance-calendar",
    "/attendance-statistics",
    "/weekly-schedule",
    "/monthly-schedule",
  ],
};
