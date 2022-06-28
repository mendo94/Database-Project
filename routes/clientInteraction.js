const express = require('express')
const clientRouter = express.Router()

clientRouter.get('/space/boxes', async (req, res) => {
    const container = await models.Container.findAll({});
    res.json(container)
})

clientRouter.get('/space/items', async (req, res) => {
    const item = await models.Item.findAll({
        include: [
          {
            model: models.Container,
            as: "container",
          },
        ],
      });
    res.json(item)
})

clientRouter.post('/items/:postItem/:containerId', async (req, res) => {
    const updateItem = await models.Item.update({
        containerId: req.params.containerId
    }, {
        where: {
            id: req.params.postItem
        }
    })
})


module.exports = clientRouter