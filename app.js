const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");
const VIEWS_PATH = path.join(__dirname, "/views");
global.models = require("./models");



const SALT_ROUNDS = 10;
const PORT = 8080;
app.engine("mustache", mustacheExpress(VIEWS_PATH + "/partials", ".mustache"));

app.use(express.urlencoded());
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

///////////////////////////////////////////////////////////////
//              Setup route for client side access
///////////////////////////////////////////////////////////////
const clientRoutes = require("./routes/clientInteraction");

app.use("/client", clientRoutes);

const objectRoutes = require("./routes/boxItemHandling");

app.use("/object-handling", objectRoutes);
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
//              LOGIN
///////////////////////////////////////////////////////////////

app.post("/landing", async (req, res) => {
  const { username, password, first_name, last_name } = req.body;

  const persistedUser = await models.User.findOne({
    where: {
      username: username,
    },
  });
  if (persistedUser == null) {
    bcrypt.hash(password, SALT_ROUNDS, async (error, hash) => {
      if (error) {
        res.render("/landing", { message: "Error, user was not created" });
      } else {
        const user = models.User.build({
          username: username,
          password: hash,
          first_name: first_name,
          last_name: last_name,
        });
        const savedUser = await user.save();
        if (savedUser != null) {
          res.redirect("/login");
        } else {
          res.render("/landing", { message: "Username already exists!" });
        }
      }
    });
  } else {
    res.render("landing-page", { message: "Username already exists!" });
  }
});

app.get("/landing", (req, res) => {
  res.render("landing-page");
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
        res.render("login", { message: "Incorrect username or password" });
      }
    });
  } else {
    res.redirect("/login", { message: "Incorrect username or password" });
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

///////////////////////////////////////////////////////////////
//              DASHBOARD
///////////////////////////////////////////////////////////////

// app.get("/homepage", async (req, res) => {
//   const containers = await models.Container.findAll({});

//   res.render("homepage", { containers: containers });
// });



app.get("/homepage", async (req, res) => {
  // res.json(item);
  res.render("homepage");
});

app.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
  }
  res.redirect("/landing");
});

app.get('/', (req, res) => {
  res.redirect('/homepage')
})

///////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
