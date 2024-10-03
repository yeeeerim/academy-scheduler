import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl; // Get the current request path

  // Skip middleware for the /login route
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // Check for the auth token in cookies
  const token = req.cookies.get("authToken");

  // Redirect to /login if the token is not found
  if (!token) {
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
  matcher: ["/", "/attendance", "/weekly-schedule", "/monthly-schedule"], // Match all routes, including dynamic ones
};
