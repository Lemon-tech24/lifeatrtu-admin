import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import bcrypt, { hash } from "bcrypt";

export async function POST(request: NextRequest) {
  const { username, pass, cpass } = await request.json();
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      if (cpass === pass) {
        const hashPass = bcrypt.hashSync(pass, 8);
        const accounts = await prisma.account.findMany();

        const existing = await prisma.account.findFirst({
          where: {
            username: username,
          },
        });

        if (accounts.length >= 10) {
          return NextResponse.json({
            ok: false,
            msg: "Moderator Account creation limit Reached",
          });
        } else {
          if (existing) {
            return NextResponse.json({
              ok: false,
              msg: "Existing Username Please Try again",
            });
          } else {
            const create_mod = await prisma.account.create({
              data: {
                username: username,
                password: hashPass,
                role: "mod",
              },
            });

            if (create_mod) {
              return NextResponse.json({
                ok: true,
                msg: "New Moderator Created",
              });
            } else {
              return NextResponse.json({
                ok: false,
                msg: "Failed to Create Moderator",
              });
            }
          }
        }
      } else {
        return NextResponse.json({
          ok: false,
          msg: "Invalid Username or Password",
        });
      }
    } else
      return NextResponse.json(
        { ok: false, message: "UNAUTHORIZED" },
        { status: 401 },
      );
  } catch (err) {
    throw new Error("Error");
  }
}
