import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getCurrentUser } from "./services/AuthServices";

const AuthRoutes = ["/login", "/signup"];

type Role = keyof typeof roleBasedRoutes;

const roleBasedRoutes = {
  VENDOR: [/^\/vendor/],
  ADMIN: [/^\/admin/],
  CUSTOMER: [/^\/customer/],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let user;
  try {
    user = await getCurrentUser();
  } catch (error) {
    console.error("Error fetching current user:", error);
    user = null;
  }

  // Unauthenticated user handling
  if (!user) {
    if (AuthRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      // Safely construct redirect URL
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)
      );
    }
  }

  // Vendor onboarding check
  if (user?.role === "VENDOR" && user?.user?.isOnboarded === false) {
    if (pathname !== "/vendor/onboarding") {
      return NextResponse.redirect(
        new URL("/vendor/onboarding", request.url)
      );
    }
    return NextResponse.next();
  }

  // Role-based route access
  if (user?.role && roleBasedRoutes[user?.role as Role]) {
    const routes = roleBasedRoutes[user?.role as Role];

    if (routes.some((route) => route.test(pathname))) {
      return NextResponse.next();
    }
  }

  // Fallback to home page for unauthorized access
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    "/customer/:path*",
    "/vendor/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};