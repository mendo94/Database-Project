const express = require('express');
const clientRouter = express.Router();

clientRouter.get('/space/rooms/', async (req, res) => {
  const container = await models.Room.findAll({
    where: {
      ownerId: req.session.user.userId
    }
  });
  res.json(container);
});

clientRouter.get('/space/boxes', async (req, res) => {
  const container = await models.Container.findAll({});
  res.json(container);
});

clientRouter.get('/space/boxes/sort/:roomId', async (req, res) => {
  const container = await models.Container.findAll({
    where: {
      roomId: req.params.roomId,
    },
  });
  res.json(container);
});

clientRouter.get('/space/items', async (req, res) => {
  const item = await models.Item.findAll({
    include: [
      {
        model: models.Container,
        as: 'container',
      },
    ],
  });
  res.json(item);
});

clientRouter.post('/update-item/:room', async (req, res) => {
  const updateItem = await models.Item.update(
    {
      name: req.body.name,
    },
    {
      where: {
        id: req.body.id,
      },
    }
  );
  res.redirect(`/navigation/room-view/${req.params.room}`)
});

clientRouter.post('/update-box/:room', async (req, res) => {
  const updateItem = await models.Container.update(
    {
      box: req.body.name,
    },
    {
      where: {
        id: req.body.id,
      },
    }
  );
  res.redirect(`/navigation/room-view/${req.params.room}`)
});

clientRouter.post('/update-box', async (req, res) => {
  const updateItem = await models.Container.update(
    {
      box: req.body.name,
    },
    {
      where: {
        id: req.body.id,
      },
    }
  );
  res.redirect(`/navigation/homepage`)
});

clientRouter.post('/update-room', async (req, res) => {
  const updateItem = await models.Room.update(
    {
      name: req.body.name,
    },
    {
      where: {
        id: req.body.id,
      },
    }
  );
  res.redirect(`/navigation/homepage`)
});

clientRouter.post('/items/:postItem/:containerId', async (req, res) => {
  const updateItem = await models.Item.update(
    {
      containerId: req.params.containerId,
    },
    {
      where: {
        id: req.params.postItem,
      },
    }
  );
});

clientRouter.post('/boxes/:postBox/:roomId', async (req, res) => {
  const updateItem = await models.Container.update(
    {
      roomId: req.params.roomId,
    },
    {
      where: {
        id: req.params.postBox,
      },
    }
  );
});

module.exports = clientRouter;
