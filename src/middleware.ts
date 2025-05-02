import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const { userId } = await getAuth(request);
  const publicPaths = ["/", "/sign-in", "/sign-up"];
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  if (!userId && !isPublicPath) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}; 