import { NextAuthOptions, AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./prisma";
import { compareSync } from "bcrypt";
export const authOptions: AuthOptions = {
  session: {
    maxAge: 60 * 60 * 24,
  },

  providers: [
    Credentials({
      type: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials) {
        if (credentials) {
          const { username, password } = credentials;

          if (
            (username === process.env.NEXT_PUBLIC_A_A &&
              password === process.env.NEXT_PUBLIC_P_A) ||
            (username === process.env.NEXT_PUBLIC_A_B &&
              password === process.env.NEXT_PUBLIC_P_B)
          ) {
            return { id: "admin", name: "Admin" };
          }

          const user = await prisma.account.findFirst({
            where: { username },
          });

          if (user && compareSync(password, user.password)) {
            return {
              id: user.id,
              name: user.username,
              role: "mod",
            };
          }

          return null;
        }
        return null;
      },
    }),
  ],

  callbacks: {
    jwt({ token, user, account, profile }) {
      if (account?.provider === "credentials" && user !== undefined) {
        token.user = user;
      }
      return token;
    },

    session({ session, token, user }) {
      if (session && token.user !== undefined) {
        session.user = token.user as any;
      }

      return session;
    },
  },
};
