const express = require('express');
const navigationRoutes = express.Router();
// const fileUpload = require('express-fileupload');

///////////////////////////////////////////////////////////////
//              DASHBOARD
///////////////////////////////////////////////////////////////

navigationRoutes.get('/edit-profile', async (req, res) => {
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
    res.render('edit-profile', {
      id: id,
      username: username,
      first_name: first_name,
      last_name: last_name,
    });
  } catch (error) {
    console.log(error);
  }
});

navigationRoutes.post('/upload', function (req, res) {
  const id = req.session.user.userId;
  const { username, first_name, last_name } = req.session.user;
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }
  console.log('req.files >>>', req.files);

  sampleFile = req.files.sampleFile;

  uploadPath = __dirname + '/uploads/' + sampleFile.name;

  sampleFile.mv(uploadPath, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    photoURL = `/uploads/${sampleFile.name}`;
    console.log(`/routes/uploads/${sampleFile.name}`);
    res.render('edit-profile', {
      photoURL: photoURL,
      id: id,
      username: username,
      first_name: first_name,
      last_name: last_name,
    });
  });
});

navigationRoutes.get('/homepage', async (req, res) => {
  const { first_name, last_name } = req.session.user;
  try {
    res.render('homepage', {
      first_name: first_name,
      last_name: last_name,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = navigationRoutes;
