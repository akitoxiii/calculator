import { withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/sign-in(.*)", "/sign-up(.*)"];
const ignoredPaths = ["/api/webhook(.*)", "/_next/(.*)"];

function isPublic(path: string) {
  return publicPaths.some((p) => path.match(new RegExp(`^${p}$`))) ||
         ignoredPaths.some((p) => path.match(new RegExp(`^${p}$`)));
}

export default withClerkMiddleware((request: NextRequest) => {
  if (isPublic(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}; 