import { NextAuthConfig } from 'next-auth'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    idToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    idToken?: string;
  }
}



export const authConfig: NextAuthConfig = {
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (typeof token.accessToken === 'string') {
        session.accessToken = token.accessToken;
      }
      if (typeof token.idToken === 'string') {
        session.idToken = token.idToken;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: `__Secure-authjs.session-token`,
      options: {
        domain: ".examina.live",
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
    },
  },
  trustHost: true,
  providers: []
};