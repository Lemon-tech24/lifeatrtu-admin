import { NextAuthOptions, AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./prisma";
import { compareSync } from "bcrypt";
export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },

  providers: [
    Credentials({
      type: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "email" },
        password: {
          label: "Password",
          type: "passowrd",
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
                return { id: checkMods.id, name: checkMods.username };
              }
            }
          }
        }
        return null;
      },
    }),
  ],
};
