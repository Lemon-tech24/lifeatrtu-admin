import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

passport.use(
  new LocalStrategy(async function (username, password, cb) {
    try {
      const admin = { id: "1", username: "admin", password: "carlhari" };

      if (username === admin.username && password === admin.password) {
        return cb(null, admin);
      }

      const user = await prisma.account.findFirst({
        where: {
          username,
        },
      });

      if (user && user.role === "moderator") {
        return cb(null, user);
      }

      return cb(null, false, { message: "Invalid Username or Password" });
    } catch (err) {
      return cb(err);
    }
  })
);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(async function (id, cb) {
  try {
    const user = await prisma.account.findUnique({
      where: {
        id,
      },
    });
    cb(null, user);
  } catch (error) {
    cb(error);
  }
});
app.use(
  session({
    secret: "we1231sda;sd[qwtqm,.sndjqowneqwe,qwoeqwe;",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
  })
);

app.get("/home", (req, res) => {
  if (req.isAuthenticated) {
    return console.log("YES your are");
  }

  return console.log("NO");
});

app.get("/check", (req, res) => {
  res.json({ ok: req.isAuthenticated() });
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("Server Running");
});
