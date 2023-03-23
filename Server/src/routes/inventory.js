const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const uuid = require('uuid');

const { getAllTable, addItemAtTable, deleteItem } = require('../DataBase/request');

const { updateItemInventory } = require('../DataBase/requestInventory');

router.use(cors());
module.exports = router;

router.post('/api/v1/addItem', async (req, res) => {
    const { name, totalItem, available, used, details } = req.body;

    const newItem = {
        name: name,
        totalItem: totalItem,
        available: available,
        used: used,
        details: details,
        id: uuid.v4(),
    };
    
    if (!newItem.name || !newItem.totalItem || !newItem.available || !newItem.used || !newItem.details) {
        return res.status(400).json({ msg: 'Please include a name, total, available, used and details' });
    }

    addItemAtTable(newItem, process.env.INVENTORY_TABLE);
    res.status(200).json(newItem);
});

router.get('/api/v1/getItems', async (req, res) => {
    const items = await getAllTable(process.env.INVENTORY_TABLE);
    if (!items) return res.status(500).json({ msg: 'Failed to get items' });
    res.status(200).json(items);
});

router.delete('/api/v1/deleteItem', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ msg: 'Please include an item name' });

    const deletedItem = await deleteItem(process.env.INVENTORY_TABLE, name);
    if (!deletedItem) return res.status(500).json({ msg: 'Failed to delete item' });

    res.status(200).json({ msg: 'Item deleted' });
});

router.post('/api/v1/modifyItem', async (req, res) => {
    const { name, row, value } = req.body;
    if (!name || !row || !value) return res.status(400).json({ msg: 'Please include a name, row and value' });

    const attributeToUpdate = `${row}`;
    const updateExpression = `SET ${row} = :valueToUpdate`;
    const expressionAttributeValues = { ":valueToUpdate": value };
    console.log(updateExpression)
    const item = await updateItemInventory(name, process.env.INVENTORY_TABLE, updateExpression, expressionAttributeValues);
    if (!item) return res.status(500).json({ msg: 'Failed to modify item' });
    res.status(200).json(item);
});
