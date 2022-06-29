const express = require("express");
const navigationRoutes = express.Router();

///////////////////////////////////////////////////////////////
//              DASHBOARD
///////////////////////////////////////////////////////////////

navigationRoutes.get("/edit-profile", async (req, res) => {
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

navigationRoutes.post("/upload", (req, res) => {
  uploadFile(req, (photoURL) => {
    res.send("UPLOAD");
  });
});

navigationRoutes.get("/homepage", async (req, res) => {
  const { first_name, last_name } = req.session.user;
  try {
    res.render("homepage", {
      first_name: first_name,
      last_name: last_name,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = navigationRoutes;
