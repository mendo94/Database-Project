const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");
const VIEWS_PATH = path.join(__dirname, "/views");
global.models = require("./models");


///////////////////////////////////////////////////////////////
//              Setup route for client side access
///////////////////////////////////////////////////////////////
const clientRoutes = require('./routes/clientInteraction')

app.use('/client', clientRoutes)
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

const SALT_ROUNDS = 10;
const PORT = 8080;
app.engine("mustache", mustacheExpress(VIEWS_PATH + "/partials", ".mustache"));

app.use(
  session({
    secret: "somesecret",
    resave: true,
    saveUninitialized: false,
  })
);
app.set("views", VIEWS_PATH);
app.set("view engine", "mustache");

app.use(express.static("static"));
app.use("/js", express.static("static"));
app.use("/css", express.static("static"));
app.use("/img", express.static("static"));

app.use(express.urlencoded());

dragPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

///////////////////////////////////////////////////////////////
//              LOGIN
///////////////////////////////////////////////////////////////
// POST register page
app.post("/login", async (req, res) => {
  const { username, password, first_name, last_name } = req.body;

  const persistedUser = await models.User.findOne({
    where: {
      username: username,
    },
  });
  if (persistedUser == null) {
    bcrypt.hash(password, SALT_ROUNDS, async (error, hash) => {
      if (error) {
        res.render("/login", { message: "Error, user was not created" });
      } else {
        const user = models.User.build({
          username: username,
          password: hash,
          first_name: first_name,
          last_name: last_name,
        });
        const savedUser = await user.save();
        if (savedUser != null) {
          res.redirect("/homepage");
        } else {
          res.render("/login", { message: "Username already exists!" });
        }
      }
    });
  } else {
    res.render("/login", { message: "Username already exists!" });
  }
});

app.post("/login", async (req, res) => {
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
          req.session.user = { userId: user.id };
          res.redirect("/homepage");
        }
      } else {
        res.render("/login", { message: "Incorrect username or password" });
      }
    });
  } else {
    res.redirect("/login", { message: "Incorrect username or password" });
  }
});

app.get("/login", async (req, res) => {
  res.render("login");
});

///////////////////////////////////////////////////////////////
//              DASHBOARD
///////////////////////////////////////////////////////////////

// app.get("/homepage", async (req, res) => {
//   const containers = await models.Container.findAll({});

//   res.render("homepage", { containers: containers });
// });

app.get("/homepage/create-box", async (req, res) => {
  res.render("create-box");
});

app.post("/homepage/create-box", async (req, res) => {
  const box = req.body.box;
  // const containerId = parseInt(req.body.containerId)

  const container = models.Container.build({
    box: box,
  });
  const persistedContainer = await container.save();
  if (persistedContainer != null) {
    res.redirect("/homepage");
  } else {
    res.render("/homeage/create-box", {
      message: "Unable to create container",
    });
  }
});

app.get("/homepage", async (req, res) => {
  const item = await models.Item.findAll({
    include: [
      {
        model: models.Container,
        as: "container",
      },
    ],
  });
  // res.json(item);
  res.render("homepage", { item: item, drag: dragPositions });
});

///////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
