import { NextAuthOptions, AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
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
          name: "Admin",
        };

        if (
          credentials &&
          credentials.username !== "admin" &&
          credentials.password !== "password"
        ) {
          throw new Error("Invalid Username or Password");
        }

        return user;
      },
    }),
  ],
};
