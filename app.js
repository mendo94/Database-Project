const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const session = require("express-session");
const path = require("path");
const VIEWS_PATH = path.join(__dirname, "/views");

const PORT = 8080;
app.engine("mustache", mustacheExpress(VIEWS_PATH + "/partials", ".mustache"));
app.set("views", VIEWS_PATH);
app.set("view engine", "mustache");

app.use(express.static("static"));
app.use("/js", express.static("static"));
app.use("/css", express.static("static"));
app.use("/img", express.static("static"));

app.use(express.urlencoded());

app.get("/homepage", (req, res) => {
  res.render("homepage");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
