const express = require('express');
const { patch } = require('./clientInteraction');
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

  uploadPath = path.join(__dirname, '..', 'static', 'uploads', sampleFile.name) ;
  console.log(uploadPath)

  sampleFile.mv(uploadPath, function (err) {
    if (err) {
      console.log(uploadPath)
      return res.status(500).send(err);
    }
    photoURL = path.join('..', 'uploads', sampleFile.name);
    console.log(`${photoURL}`);
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


    res.render("room-dashboard-display", {

      first_name: first_name,
      last_name: last_name,
      username: req.session.user.username,
    });
  } catch (error) {
    console.log(error);
  }
});

navigationRoutes.get('/room-view/:roomId', async (req, res) => {
  const room = await models.Room.findByPk(req.params.roomId);
  const { first_name, last_name } = req.session.user;
  console.log(room);
  res.render(`homepage`, {
    currentRoom: room.name,
    roomId: room.id,
    first_name: first_name,
    last_name: last_name,
  });
});

module.exports = navigationRoutes;
