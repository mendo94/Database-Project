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
const clientRoutes = require("./routes/clientInteraction");

app.use("/client", clientRoutes);
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

const PORT = 8080;
app.engine("mustache", mustacheExpress(VIEWS_PATH + "/partials", ".mustache"));
const userRouter = require("./routes/loginRegistration");
app.use(
  session({
    secret: "somesecret",
    resave: true,
    saveUninitialized: false,
  })
);
app.use(express.urlencoded());
app.use("/users", userRouter);
app.set("views", VIEWS_PATH);
app.set("view engine", "mustache");

app.use(express.static("static"));
app.use("/js", express.static("static"));
app.use("/css", express.static("static"));
app.use("/img", express.static("static"));

dragPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

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

app.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
  }
  res.redirect("/registration");
});

app.get("/", (req, res) => {
  res.redirect("/homepage");
});

///////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
