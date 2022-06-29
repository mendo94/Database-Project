const express = require('express')
const clientRouter = express.Router()

clientRouter.get("/create-box", async (req, res) => {
    res.render("create-box");
});

clientRouter.get("/create-item/:containerName/:containerId", async (req, res) => {
    res.render("create-item", {containerId: req.params.containerId, containerName: req.params.containerName});
});

clientRouter.post("/create-box", async (req, res) => {
    const box = req.body.box;

    const container = models.Container.build({
        box: box,
    });
    const persistedContainer = await container.save();
    if (persistedContainer != null) {
        res.redirect("/homepage");
    } else {
        res.render("/create-box", {
            message: "Unable to create container",
        });
    }
});

clientRouter.post("/create-item", async (req, res) => {
    const name = req.body.item;
    const containerId = req.body.containerId;

    const item = models.Item.build({
        name: name,
        containerId: containerId
    });
    const persistedItem = await item.save();
    if (persistedItem != null) {
        res.redirect("/homepage");
    } else {
        res.render("/create-box", {
            message: "Unable to create item",
        });
    }
});

clientRouter.get('/delete/box/:id', async (req, res) => {
    await models.Item.destroy({
        where: {
            containerId: req.params.id
        }
    })
    await models.Container.destroy({
        where: {
            id: req.params.id
        }
    })
    res.redirect('/')
})

clientRouter.get('/delete/item/:id', async (req, res) => {
    await models.Item.destroy({
        where: {
            id: req.params.id
        }
    })
    res.redirect('/')
})

module.exports = clientRouter