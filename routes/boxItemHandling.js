const express = require('express');
const session = require('express-session');
const clientRouter = express.Router();

clientRouter.get('/create-box/:page/:roomId', async (req, res) => {
  res.render('object-creation/create-box', {
    roomId: req.params.roomId,
    page: req.params.page,
    profilePicture: req.session.user.profilePicture,
    id: req.session.user.userId,
    username: req.session.user.username,
    first_name: req.session.user.first_name,
    last_name: req.session.user.last_name,
  });
});

clientRouter.get(
  '/create-item/:roomId/:containerId',
  async (req, res) => {
    res.render('object-creation/create-item', {
      containerId: req.params.containerId,
      containerName: req.body.containerName,
      roomId: req.params.roomId,
      profilePicture: req.session.user.profilePicture,
      id: req.session.user.userId,
      username: req.session.user.username,
      first_name: req.session.user.first_name,
      last_name: req.session.user.last_name,
    });
  }
);

clientRouter.get('/create-room', async (req, res) => {
  res.render('object-creation/create-room', {
    
    profilePicture: req.session.user.profilePicture,
    id: req.session.user.userId,
    username: req.session.user.username,
    first_name: req.session.user.first_name,
    last_name: req.session.user.last_name,
  });
});

clientRouter.post('/create-box/:page', async (req, res) => {
  const box = req.body.box;

  const container = models.Container.build({
    box: box,
    roomId: req.body.roomId,
  });
  const persistedContainer = await container.save();
  if (persistedContainer != null) {
    if (req.params.page == 'room') {
      res.redirect('/navigation/homepage');
    } else {
      res.redirect(`/navigation/room-view/${req.body.roomId}`);
    }
  } else {
    res.render(`object-creation/create-box/${req.params.page}`, {
      message: 'Unable to create container',
      roomId: req.body.roomId,
      profilePicture: req.session.user.profilePicture,
      id: req.session.user.userId,
      username: req.session.user.username,
      first_name: req.session.user.first_name,
      last_name: req.session.user.last_name,
    });
  }
});

clientRouter.post('/create-item/:roomId', async (req, res) => {
  const name = req.body.item;
  const containerId = req.body.containerId;

  const item = models.Item.build({
    name: name,
    containerId: containerId,
  });

    const persistedItem = await item.save();
    if (persistedItem != null) {
      res.redirect(`/navigation/room-view/${req.params.roomId}`);
    } else {
      res.render('object-creation/create-item', {
        message: 'Unable to create item',
        profilePicture: req.session.user.profilePicture,
        id: req.session.user.userId,
        username: req.session.user.username,
        first_name: req.session.user.first_name,
        last_name: req.session.user.last_name,
      });
    }

});

clientRouter.post('/create-room', async (req, res) => {
  const name = req.body.room;

  const container = models.Room.build({
    name: name,
    ownerId: req.session.user.userId,
  });
  const persistedContainer = await container.save();
  if (persistedContainer != null) {
    res.redirect('/navigation/homepage');
  } else {
    res.render('object-creation/create-room', {
      message: 'Unable to create room',
      profilePicture: req.session.user.profilePicture,
      id: req.session.user.userId,
      username: req.session.user.username,
      first_name: req.session.user.first_name,
      last_name: req.session.user.last_name,
    });
  }
});

clientRouter.get('/delete/box/:page/:id', async (req, res) => {
  await models.Item.destroy({
    where: {
      containerId: req.params.id,
    },
  });
  await models.Container.destroy({
    where: {
      id: req.params.id,
    },
  });
  if (req.params.page == 'room') {
    res.redirect('/navigation/homepage');
  } else {
    res.redirect(`/navigation/room-view/${req.query.roomId}`);
  }
});

clientRouter.get('/delete/item/:roomId/:id', async (req, res) => {
  await models.Item.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.redirect(`/navigation/room-view/${req.params.roomId}`);
});

clientRouter.get('/delete/room/:id', async (req, res) => {
  let containers = await models.Container.findAll({
    where: {
      roomId: req.params.id,
    },
  });
  containers.forEach(async (container) => {
    await models.Item.destroy({
      where: {
        containerId: container.id,
      },
    });
  });
  
  await models.Container.destroy({
    where: {
      roomId: req.params.id,
    },
  });
  await models.Room.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.redirect(`/navigation/homepage`);
});

module.exports = clientRouter;
