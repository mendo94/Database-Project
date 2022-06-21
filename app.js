const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
// const cors = require("cors");
const session = require("express-session");
// const VIEWS_PATH = path.join(__dirname, "/views");

app.use("/js", express.static("static"));
app.use("/css", express.static("static"));
app.use("/img", express.static("static"));

app.engine("mustache", mustacheExpress(VIEWS_PATH + "/partials", ".mustache"));
app.set("views", VIEWS_PATH);
app.set("view engine", "mustache");

app.use(express.urlencoded());
// app.use(cors());

http.listen(8080, () => {
  console.log("Server is running...");
});
