const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
// const models = require("../models");

const SALT_ROUNDS = 10;

///////////////////////////////////////////////////////////////
//              LOGIN
///////////////////////////////////////////////////////////////

userRouter.post("/registration", async (req, res) => {
  const { username, password, first_name, last_name } = req.body;

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
          first_name: first_name,
          last_name: last_name,
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
  const { username, password } = req.body;

  const user = await models.User.findOne({
    where: {
      username: username,
    },
  });
  if (user != null) {
    bcrypt.compare(password, user.password, (error, result) => {
      if (result) {
        if (req.session) {
          req.session.user = {
            userId: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
          };
          console.log(user);
          res.redirect("/homepage");
        }
      } else {
        res.render("login", { message: "Incorrect username or password" });
      }
    });
  } else {
    res.redirect("/users/login", { message: "Incorrect username or password" });
  }
});

userRouter.get("/login", (req, res) => {
  res.render("login");
});

module.exports = userRouter;
