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
        const user = {
          id: "1",
          name: "Admin1",
        };
        const user_1 = {
          id: "2",
          name: "Admin2",
        };

        if (credentials) {
          if (
            credentials.username === `${process.env.NEXT_PUBLIC_A_A}` &&
            credentials.password === `${process.env.NEXT_PUBLIC_P_A}`
          ) {
            return user;
          } else if (
            credentials.username === `${process.env.NEXT_PUBLIC_A_B}` &&
            credentials.password === `${process.env.NEXT_PUBLIC_P_B}`
          ) {
            return user_1;
          } else {
            const checkMods = await prisma.account.findFirst({
              where: {
                username: credentials.username,
              },
            });

            if (checkMods) {
              const comparePass = compareSync(
                credentials.password,
                checkMods.password,
              );

              if (comparePass) {
                return {
                  id: checkMods.id,
                  name: checkMods.username,
                  role: "mod",
                };
              }
              return { id: "", name: "" }; // or return {} or any other appropriate value
            }
            return { id: "", name: "" };
          }
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
