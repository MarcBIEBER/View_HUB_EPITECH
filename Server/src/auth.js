const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyAccessToken (req, res, next) {
    const authHeader = req.body.token;
    jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send(err);
        req.user_decrypted = user;
        next();
    });
};

function verifyAdminToken (req, res, next) {
    const authHeader = req.body.token || req.query.token;
    jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send(err);
        if (user.email !== process.env.ADMIN_EMAIL) return res.status(403).send({ msg: 'You are not authorized to do this' });
        next();
    });
};

function verifyTokenForDelete (token, owner) {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (user.email !== process.env.ADMIN_EMAIL && user.email != owner ) return false;
    return true;
}

module.exports = {
    verifyAccessToken,
    verifyAdminToken,
    verifyTokenForDelete
};