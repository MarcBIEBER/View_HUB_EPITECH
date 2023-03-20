const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

router.use(cors());
module.exports = router;
