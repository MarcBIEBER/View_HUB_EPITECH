const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { getAllTable, getUser, addItemAtTable, deleteItem } = require('../DataBase/request');

router.use(cors());
module.exports = router;

router.get('/api/v1/getProjects', async (req, res) => {
    const projects = await getAllTable('hubProjectTable');
    res.status(200).json(projects);
});

router.post('/api/v1/createProject', async (req, res) => {
    // TODO: check here if the name is already taken
    const newProject = {
        name: req.body.name,
        id: uuid.v4(),
        description: req.body.description,
        date: req.body.date,
        owner: req.body.owner,
    };
    if (!newProject.name || !newProject.description || !newProject.date || !newProject.owner) {
        return res.status(400).json({ msg: 'Please include a name, description, date and owner' });
    }

    addItemAtTable(newProject, 'hubProjectTable');
    res.status(200).json(newProject);
});

router.delete('/api/v1/deleteProject', async (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ msg: 'Please include a name' });
    }
    // Check if the user is the owner of the project or an admin
    await deleteItem('hubProjectTable', req.body.name);
    res.status(200);
});