const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const uuid = require('uuid');

const { getAllTable, addItemAtTable, deleteItem } = require('../DataBase/request');

const { updateItemInventory, getItem } = require('../DataBase/requestInventory');
const { verifyAdminToken, verifyAccessToken } = require('../auth');

router.use(cors());
module.exports = router;

router.post('/api/v1/addItem', verifyAdminToken, async (req, res) => {
    const { name, totalItem } = req.body;

    if (!name || !totalItem) return res.status(400).json({ msg: 'Please include a name and total' });

    if (await getItem(name)) return res.status(400).json({ msg: 'Item already exists' });

    const newItem = {
        name: name,
        totalItem: totalItem,
        available: totalItem,
        used: 0,
        details: "Aucun détails",
        id: uuid.v4(),
    };
    
    if (!newItem.name || !newItem.totalItem) {
        return res.status(400).json({ msg: 'Please include a name and total' });
    }

    addItemAtTable(newItem, process.env.INVENTORY_TABLE);
    res.status(200).json(newItem);
});

router.get('/api/v1/getItems', async (req, res) => {
    const items = await getAllTable(process.env.INVENTORY_TABLE);
    if (!items) return res.status(500).json({ msg: 'Failed to get items' });
    res.status(200).json(items);
});

router.delete('/api/v1/deleteItem', verifyAdminToken, async (req, res) => {
    const name = req.query.name;
    if (!name) return res.status(400).json({ msg: 'Please include an item name' });

    const deletedItem = await deleteItem(process.env.INVENTORY_TABLE, name);
    if (!deletedItem) return res.status(500).json({ msg: 'Failed to delete item' });

    res.status(200).json({ msg: 'Item deleted' });
});

router.post('/api/v1/modifyItem', verifyAdminToken, async (req, res) => {
    const { name, row, value } = req.body;
    if (!name || !row || !value) return res.status(400).json({ msg: 'Please include a name, row and value' });

    const updateExpression = `SET ${row} = :valueToUpdate`;
    const expressionAttributeValues = { ":valueToUpdate": value };
    const item = await updateItemInventory(name, process.env.INVENTORY_TABLE, updateExpression, expressionAttributeValues);
    if (!item) return res.status(500).json({ msg: 'Failed to modify item' });
    res.status(200).json(item);
});

router.post('/api/v1/askForItem', verifyAccessToken, async (req, res) => {
    const { quantity, reason } = req.body;
    if (!quantity || !reason) return res.status(400).json({ msg: 'Please include a quantity and reason' });
    
    //TODO: Send email to admin here
    
    res.status(200).send("OK");
});