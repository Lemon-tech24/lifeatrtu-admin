"use server";

import prisma from "../lib/prisma";
import bcrypt from "bcrypt";

export async function createModerator(currentState: any, formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");
  const cpassword = formData.get("cpassword");

  if (username && password && cpassword) {
    const passwordString = String(password);
    const cpasswordString = String(cpassword);
    const usernameString = String(username);

    if (cpasswordString === passwordString) {
      const hashPass = bcrypt.hashSync(passwordString, 8);
      const accounts = await prisma.account.findMany();

      const existing = await prisma.account.findFirst({
        where: {
          username: usernameString,
        },
      });

      if (accounts.length >= 10) {
        return { error: "Moderator Account creation limit reached" };
      } else {
        if (existing) {
          return { error: "Existing Username Please Try again" };
        } else {
          try {
            const create_mod = await prisma.account.create({
              data: {
                username: String(username),
                password: hashPass,
                role: "mod",
              },
            });
            if (create_mod) {
              return { message: "New Moderator Created" };
            }

            return { error: "Failed" };
          } catch (err) {
            console.error(err);
            return { error: "Error Occured" };
          }
        }
      }
    } else return { error: "Invalid Password or Username" };
  }
}
