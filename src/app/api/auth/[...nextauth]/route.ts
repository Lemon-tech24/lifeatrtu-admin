import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "creds",
      credentials: {
        username: { label: "Username", type: "text", name: "username" },
        password: { label: "Password", type: "password", name: "passwords" },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.username || !credentials.password) {
          return null;
        }
        const user = {
          id: "1123",
          name: "admin",
          username: "admin",
          password: "pass1234",
        };

        if (
          credentials.username === user.username ||
          credentials.password === user.password
        ) {
          return user;
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
