const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
// const formidable = require("formidable");
const path = require("path");

const VIEWS_PATH = path.join(__dirname, "/views");
const __basedir = __dirname;
global.models = require("./models");

const PORT = 8080;
app.engine("mustache", mustacheExpress(VIEWS_PATH + "/partials", ".mustache"));

app.use(
  session({
    secret: "somesecret",
    resave: true,
    saveUninitialized: false,
  })
);
app.use(express.urlencoded());

app.set("views", VIEWS_PATH);
app.set("view engine", "mustache");

app.use(express.static("static"));
app.use("/js", express.static("static"));
app.use("/css", express.static("static"));
app.use("/img", express.static("static"));
app.use("/uploads", express.static("static"));

///////////////////////////////////////////////////////////////
//              Setup route for client side access
///////////////////////////////////////////////////////////////
const userRouter = require("./routes/loginRegistration");

app.use("/users", userRouter);

const clientRoutes = require("./routes/clientInteraction");

app.use("/client", clientRoutes);

const objectRoutes = require("./routes/boxItemHandling");
const formidable = require("formidable");

app.use("/object-handling", objectRoutes);

const userRouter = require("./routes/loginRegistration");

app.use("/users", userRouter);
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
//              DASHBOARD
///////////////////////////////////////////////////////////////

app.get("/edit-profile", async (req, res) => {
  const id = req.session.user.userId;
  const { username, first_name, last_name } = req.session.user;

  try {
    const user = await models.User.findAll({
      where: {
        id: id,
        username: username,
        first_name: first_name,
        last_name: last_name,
      },
    });
    // res.json(user);
    res.render("edit-profile", {
      id: id,
      username: username,
      first_name: first_name,
      last_name: last_name,
    });
  } catch (error) {
    console.log(error);
  }
});

function uploadFile(req, callback) {
  new formidable.IncomingForm()
    .parse(req)
    .on("fileBegin", (name, file) => {
      file.path = __basedir + "/uploads/" + file.name;
    })
    .on("file", (name, file) => {
      callback(file.name);
    });
}

app.post("/upload", (req, res) => {
  uploadFile(req, (photoURL) => {
    res.send("UPLOAD");
  });
});

app.get("/homepage", async (req, res) => {
  const { first_name, last_name } = req.session.user;
  res.render("homepage", {
    first_name: first_name,
    last_name: last_name,
  });
});

app.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
  }
  res.redirect("/registration");
});

app.get("/", (req, res) => {
  res.redirect("/users/registration");
});

///////////////////////////////////////////////////////////////

// table for household
app.get("/household-members", (req, res) => {
  res.render("household-members");
});

app.get("/create-room", (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
