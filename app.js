const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const session = require("express-session");
const path = require("path");
const VIEWS_PATH = path.join(__dirname, "/views");
const models = require("./models");

const PORT = 8080;
app.engine("mustache", mustacheExpress(VIEWS_PATH + "/partials", ".mustache"));
app.set("views", VIEWS_PATH);
app.set("view engine", "mustache");

app.use(express.static("static"));
app.use("/js", express.static("static"));
app.use("/css", express.static("static"));
app.use("/img", express.static("static"));

app.use(express.urlencoded());

// GET register page
app.get("/register", (req, res) => {
  res.render("register");
});

// POST register page
app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await models.User.build({
    username: username,
    password: password,
  });

  user.save.then(() => {
    res.redirect("login");
  });
});

///////////////////////////////////////////////////////////////
//              DASHBOARD
///////////////////////////////////////////////////////////////

app.get("/homepage", async (req, res) => {
  const containers = await models.Container.findAll({});

  res.render("homepage", { containers: containers });
});

app.get("/login", async (req, res) => {
  res.render("login");
});
app.get("/homepage/create-box", async (req, res) => {
  res.render("create-box");
});

app.post("/homepage/create-box", async (req, res) => {
  const box = req.body.box;

  const conatiner = await models.Container.build({
    box: box,
  });
  console.log(conatiner);
  res.render("/homeage/create-box");
});

///////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
