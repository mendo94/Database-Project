const express = require('express');
const { patch } = require('./clientInteraction');
const navigationRoutes = express.Router();
// const fileUpload = require('express-fileupload');

///////////////////////////////////////////////////////////////
//              DASHBOARD
///////////////////////////////////////////////////////////////

navigationRoutes.get('/edit-profile', async (req, res) => {
  const id = req.session.user.userId;
  const { username, first_name, last_name, profilePicture } = req.session.user;

  try {
    const user = await models.User.findAll({
      where: {
        id: id
      },
    });
    // res.json(user);
    res.render('edit-profile', {
      profilePicture: req.session.user.profilePicture,
      id: id,
      username: username,
      first_name: first_name,
      last_name: last_name,
    });
  } catch (error) {
    console.log(error);
  }
});

navigationRoutes.post('/upload', async (req, res) => {
  const id = req.session.user.userId;
  const { username, first_name, last_name, profilePicture } = req.session.user;
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }
  console.log('req.files >>>', req.files);

  sampleFile = req.files.sampleFile;

  uploadPath = path.join(__dirname, '..', 'static', 'uploads', sampleFile.name);
  console.log(uploadPath);

  sampleFile.mv(uploadPath, async (err) => {
    if (err) {
      console.log(uploadPath);
      return res.status(500).send(err);
    }
    photoURL = path.join('..', 'uploads', sampleFile.name);
    console.log(`${photoURL}`);
    const updateItem = await models.User.update(
      {
        profilePicture: photoURL,
      },
      {
        where: {
          id: id,
        },
      }
    );
    req.session.user.profilePicture = photoURL;
    res.render('edit-profile', {
      profilePicture: photoURL,
      id: id,
      username: username,
      first_name: first_name,
      last_name: last_name,
    });
  });
});

navigationRoutes.post('/save-edits', async (req, res) => {
  console.log(`Edit body: ${req.body.first_name}`);
  req.session.user.username = req.body.username;
  req.session.user.first_name = req.body.first_name;
  req.session.user.last_name = req.body.last_name;
  const editedProfile = await models.User.update({
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name
    },
    {
      where: {
        id: req.session.user.userId
      }
    });
  res.redirect('/navigation/edit-profile')
})

navigationRoutes.get('/homepage', async (req, res) => {
  try {
    res.render('room-dashboard-display', {
      profilePicture: req.session.user.profilePicture,
      id: req.session.user.userId,
      username: req.session.user.username,
      first_name: req.session.user.first_name,
      last_name: req.session.user.last_name,
    });
  } catch (error) {
    console.log(error);
  }
});

navigationRoutes.get('/room-view/:roomId', async (req, res) => {
  const room = await models.Room.findByPk(req.params.roomId);
  console.log(room);
  res.render(`homepage`, {
    currentRoom: room.name,
    roomId: room.id,
    profilePicture: req.session.user.profilePicture,
    id: req.session.user.userId,
    username: req.session.user.username,
    first_name: req.session.user.first_name,
    last_name: req.session.user.last_name,
  });
});

module.exports = navigationRoutes;
