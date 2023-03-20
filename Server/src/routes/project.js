const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { getAllTable, addItemAtTable, deleteItem, updateItem } = require('../DataBase/request');
const { getUser } = require('../DataBase/requestUser');

router.use(cors());
module.exports = router;

router.get('/api/v1/getProjects', async (req, res) => {
    const projects = await getAllTable(process.env.PROJECT_TABLE);
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

    addItemAtTable(newProject, process.env.PROJECT_TABLE);
    res.status(200).json(newProject);
});

router.delete('/api/v1/deleteProject', async (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ msg: 'Please include a name' });
    }
    //TODO: Check if the user is the owner of the project or an admin
    const returnVal = await deleteItem(process.env.PROJECT_TABLE, req.body.name);
    if (!returnVal) {
        return res.status(400).json({ msg: 'Project not found' });
    }
    res.status(200).json({ msg: 'Project deleted' });
});

router.post("/api/v1/subscribeToProject", async (req, res) => {
    if (!req.body.email || !req.body.projectId) {
        return res.status(400).json({ msg: 'Please include a name' });
    }
    var newValue = []
    const userValue = await getUser(req.body.email);
    //TODO: check if the user is already subscribed to the project
    if (userValue.currentSubscibedProject.length > 0) {
        newValue.push(...userValue.currentSubscibedProject)
        newValue.push(req.body.projectId);
    } else {
        newValue.push(req.body.projectId);
    }
    const updateExpression = "SET currentSubscibedProject = :currentSubscibedProject";
    const expressionAttributeValues = {
        ":currentSubscibedProject": newValue,
    };
    await updateItem(req.body.email, process.env.USER_TABLE, updateExpression, expressionAttributeValues);
    res.status(200).json({ msg: 'Project subscribed' });
});