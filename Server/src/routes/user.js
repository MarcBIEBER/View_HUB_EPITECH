const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { addItemAtTable, deleteItem } = require('../DataBase/request');
const { getUser, updateItem } = require('../DataBase/requestUser');
const { verifyAccessToken, verifyAdminToken } = require('../auth');

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
            await updateItem(req.body.email, process.env.USER_TABLE, updateExpression, expressionAttributeValues);

            res.status(200).send(user);
        } else {
            res.status(400).json({ msg: 'Email or password is wrong' });
        }
    } else {
        res.status(400).json({ msg: 'Email or password is wrong' });
    }
});

router.post('/api/v1/register', async (req, res) => {
    const { email, password, urlToImg } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please include an email and a password' });
    }
    if (await getUser(email)) {
        return res.status(400).json({ msg: 'Email is already taken' });
    }
    const user = {
        email: email,
        password: null,
        creationDate: new Date().toISOString(),
        accessToken: null,
        urlImage: urlToImg ? urlToImg : null,
        currentSubscibedProject: [],
    }
    user.password = await bcrypt.hash(password, 10);
    user.accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "24h" });
    addItemAtTable(user, process.env.USER_TABLE);
    res.status(200).send(user);
});

router.get('/api/v1/getUserImage', async (req, res) => {
    const email = req.query.email;
    if (!email) return res.status(400).json({ msg: 'Please include an email' });
    const user = await getUser(email);
    if (!user) return res.status(400).json({ msg: 'User not found' });
    res.status(200).send(user.urlImage);
});

router.post('/api/v1/checkToken', verifyAccessToken, async (req, res) => {
    return res.status(200).send({ msg: 'Token is valid' });
});

router.post('/api/v1/checkSuperToken', verifyAdminToken, async (req, res) => {
    return res.status(200).send({ msg: 'Token is valid' });
});