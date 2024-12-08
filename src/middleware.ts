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

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const user = await getCurrentUser();

  if (!user) {
    if (AuthRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, request.url)
      );
    }
  }

  if (user?.role && roleBasedRoutes[user?.role as Role]) {
    if (user?.role === "VENDOR" && user?.user?.isOnboarded === false) {
      return NextResponse.redirect(new URL(`/vendor/onboarding`, request.url));
    }
    const routes = roleBasedRoutes[user?.role as Role];

    if (routes.some((route) => pathname.match(route))) {
      return NextResponse.next();
    }
  }

  return NextResponse.redirect(new URL("/", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/customer",
    "/customer/:page*",
    "/vendor",
    "/vendor/:page*",
    "/admin",
    "/admin/:page*",
    "/login",
    "/signup",
  ],
};
