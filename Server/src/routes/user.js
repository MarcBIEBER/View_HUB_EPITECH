const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { getAllTable, getUser, addItemAtTable, deleteItem, updateItem } = require('../DataBase/request');

router.use(cors());
module.exports = router;

router.post('/api/v1/login', async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ msg: 'Please include an email and a password' });
    }
    const user = await getUser(req.body.email);
    if (user) {
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (isMatch) {       
            user.accessToken
            user.accessToken = null;
            user.accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
            const updateExpression = "SET accessToken = :accessToken";
            const expressionAttributeValues = {
                ":accessToken": user.accessToken,
            };
            await updateItem(req.body.email, updateExpression, expressionAttributeValues);

            res.cookie('accessToken', user.accessToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
            res.status(200).send(user);
        } else {
            res.status(400).json({ msg: 'Email or password is wrong' });
        }
    } else {
        res.status(400).json({ msg: 'Email or password is wrong' });
    }
});

router.post('/api/v1/register', async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ msg: 'Please include an email and a password' });
    }
    // TODO: check here if the email is already taken
    const user = {
        email: req.body.email,
        password: null,
        id: uuid.v4(),
        creationDate: new Date().toISOString(),
        accessToken: null
    }
    user.password = await bcrypt.hash(req.body.password, 10);
    user.accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "24h" });
    addItemAtTable(user, 'hubUserTable');
    res.status(200).send(user);
});