import { NextURL } from 'next/dist/server/web/next-url';

interface AuthConfig {
  pages: {
    signIn: string;
    signUp: string;
  };
  callbacks: {
    authorized: (params: { 
      auth: { user: any } | null; 
      request: { nextUrl: NextURL }; 
    }) => boolean;
  };
}

export const authConfig: AuthConfig = {
  pages: {
    signIn: '/sign-in',
    signUp: '/sign-up',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return true;
      }
      return true;
    },
  },
}; 