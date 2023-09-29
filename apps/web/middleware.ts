import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default function middleware(req: NextRequest) {
  const { pathname, search, origin, basePath } = req.nextUrl;

  if (!req.cookies.has("next-auth.session-token")) {
    const signInUrl = new URL(`${basePath}/api/auth/signin`, origin);

    signInUrl.searchParams.append(
      "callbackUrl",
      `${basePath}${pathname}${search}`
    );

    return NextResponse.redirect(signInUrl);
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`${basePath}/workspaces`, origin));
  }
}
