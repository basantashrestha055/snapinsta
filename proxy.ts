import { NextResponse, NextRequest } from "next/server"
import { auth } from "./auth"

export async function proxy(request: NextRequest) {
  const session = await auth()
  const url = request.nextUrl

  if (session && url.pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url))
  }

  if (!session && url.pathname === "/") {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  if (
    session &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify-code"))
  ) {
    return NextResponse.redirect(new URL("/home", request.url))
  }

  if (
    !session &&
    (url.pathname.startsWith("/home") ||
      url.pathname.startsWith("/profile") ||
      url.pathname.startsWith("/reels") ||
      url.pathname.startsWith("/messages"))
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/verify/:path*",
    "/home/:path*",
    "/profile/:path*",
    "/reels/:path*",
    "/messages/:path*",
    "/",
  ],
}
