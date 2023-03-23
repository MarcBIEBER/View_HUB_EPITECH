const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const { getAllTable, addItemAtTable, deleteItem } = require('../DataBase/request');

router.use(cors());
module.exports = router;

router.post('/api/v1/addItem', async (req, res) => {
    const { name, total, available, used, details, } = req.body;

    const newItem = {
        name: name,
        total: total,
        available: available,
        used: used,
        details: details
    };
    
    if (!newItem.name || !newItem.total || !newItem.available || !newItem.used || !newItem.details) {
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
