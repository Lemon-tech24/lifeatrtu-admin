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
      const user = await prisma.account.findFirst({
        where: {
          username,
        },
      });

      console.log("prisma ito", user);

      if (!user && user.role !== "moderator") {
        return cb(null, false, { message: "Invalid Username or Password" });
      }

      return cb(null, user);
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

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      console.error("Authentication failed:", info.message);
      return res.status(401).json({ message: "Invalid username or password" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      console.log("Authentication successful:", user.username);
      return res.json({ message: "Success", user });
    });
  })(req, res, next);
});

app.listen(PORT, () => {
  console.log("Server Running");
});
