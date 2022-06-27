const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const session = require("express-session");
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

const PORT = 8080;
app.engine("mustache", mustacheExpress(VIEWS_PATH + "/partials", ".mustache"));
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

// app.get("/homepage/items/:itemId", async (req, res) => {
//   const itemId = parseInt(req.params.itemId);

//   const item = await models.Item.findByPk(itemId, {
//     include: [
//       {
//         model: models.Container,
//         as: "container",
//       },
//     ],
//   });
//   res.render("homepage", { item: item });
// });
///////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
