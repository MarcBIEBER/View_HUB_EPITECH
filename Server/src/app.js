const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

const userAPIRouter = require('./routes/user');
const inventoryAPIRouter = require('./routes/inventory');
const projectsAPIRouter = require('./routes/projects');
app.use('/user', userAPIRouter);
app.use('/inventory', inventoryAPIRouter);
app.use('/project', projectsAPIRouter);


app.set('view engine', 'ejs');

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'secret',
}));

require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/ping', (req, res) => {
    return res.status(200).send('Server is running');
});

module.exports = app;

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
