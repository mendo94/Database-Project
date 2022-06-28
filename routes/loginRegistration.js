const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
// const models = require("../models");

const SALT_ROUNDS = 10;

///////////////////////////////////////////////////////////////
//              LOGIN
///////////////////////////////////////////////////////////////

userRouter.post("/registration", async (req, res) => {
  // const { first_name, last_name } = req.body;
  const username = req.body.username;
  const password = req.body.password;
  console.log(username);

  const persistedUser = await models.User.findOne({
    where: {
      username: username,
    },
  });
  if (persistedUser == null) {
    bcrypt.hash(password, SALT_ROUNDS, async (error, hash) => {
      if (error) {
        res.render("registration", { message: "Error, user was not created" });
      } else {
        const user = models.User.build({
          username: username,
          password: hash,
        });
        const savedUser = await user.save();
        if (savedUser != null) {
          res.redirect("/users/login");
        } else {
          res.render("/users/registration", {
            message: "Username already exists!",
          });
        }
      }
    });
  } else {
    res.render("registration", { message: "Username already exists!" });
  }
});

userRouter.get("/registration", (req, res) => {
  res.render("registration");
});

userRouter.post("/login", async (req, res) => {
  // const { username, password } = req.body;
  const username = req.body.username;
  const password = req.body.password;

  console.log(username);
  const user = await models.User.findOne({
    where: {
      username: username,
    },
  });
  console.log(user);
  if (user != null) {
    bcrypt.compare(password, user.password, (error, result) => {
      if (result) {
        if (req.session) {
          req.session.user = { userId: user.id };
          res.redirect("/homepage");
        }
      } else {
        res.render("login", { message: "Incorrect username or password" });
      }
    });
  } else {
    res.redirect("users/login", { message: "Incorrect username or password" });
  }
});

userRouter.get("/login", (req, res) => {
  res.render("login");
});

module.exports = userRouter;
