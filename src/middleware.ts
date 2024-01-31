import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./app/auth";

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/approval",
  "/admin",
  "/",
  "/history",
];

export default async function middleware(request: NextRequest) {
  const session = await auth();

  const isProtectedRoute = protectedRoutes.some(
    (prefix) => request.nextUrl.pathname === prefix,
  );

  if (session && request.nextUrl.pathname === "/auth/login") {
    const absoluteURL = new URL(request.nextUrl.origin + "/");
    return NextResponse.redirect(absoluteURL.toString());
  }

  if (!session && isProtectedRoute) {
    const absoluteURL = new URL(request.nextUrl.origin + "/auth/login");
    return NextResponse.redirect(absoluteURL.toString());
  }
}
