import type { NextRequest } from "next/server";
import { getAuth } from "./app/(auth)/actions";
export async function middleware(request: NextRequest) {
  const currentUser = await getAuth();
  if (currentUser && request.nextUrl.pathname.startsWith("/connexion")) {
    return Response.redirect(new URL("/", request.url));
  }
  if (
    !currentUser &&
    !request.nextUrl.pathname.startsWith("/connexion") &&
    !request.nextUrl.pathname.startsWith("/verify")
  ) {
    return Response.redirect(new URL("/connexion", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
