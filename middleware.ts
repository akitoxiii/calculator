import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/"]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    return;
  }
});

export const config = {
  matcher: [
    /*
     * APIやページのパスに合わせて調整
     * 例: すべてのルートでClerkの認証を有効にしたい場合は下記のように
     */
    "/((?!_next|.*\\..*).*)",
  ],
};