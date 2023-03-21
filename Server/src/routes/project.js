const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { getAllTable, addItemAtTable, deleteItem } = require('../DataBase/request');
const { getUser, updateItem } = require('../DataBase/requestUser');
const { getProject, updateItemProject } = require('../DataBase/requestProject');

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
        currentSubscriber: []
    };
    if (!newProject.name || !newProject.description || !newProject.date || !newProject.owner) {
        return res.status(400).json({ msg: 'Please include a name, description, date and owner' });
    }

    addItemAtTable(newProject, process.env.PROJECT_TABLE);
    res.status(200).json(newProject);
});

router.delete('/api/v1/deleteProject', async (req, res) => {
    const { name, owner } = req.body;
    if (!name || !owner) return res.status(400).json({ msg: 'Please include a name and owner' });

    const project = await getProject(name);
    if (!project) return res.status(400).json({ msg: 'Project not found' });

    // TODO: Check if the user is the owner of the project or an admin
    if (project.owner !== req.body.owner) return res.status(400).json({ msg: 'You are not the owner of this project' });

    const deletedProject = await deleteItem(process.env.PROJECT_TABLE, name);
    if (!deletedProject) return res.status(500).json({ msg: 'Failed to delete project' });

    res.status(200).json({ msg: 'Project deleted' });
});

router.post("/api/v1/subscribeToProject", async (req, res) => {
    const { email, projectId, name } = req.body;
    if (!email || !projectId) return res.status(400).json({ msg: 'Please include an email and projectId' });

    const userValue = await getUser(email);
    if (userValue.currentSubscibedProject.includes(projectId)) return res.status(400).json({ msg: 'User is already subscribed to this project' });

    const projectValue = await getProject(name);
    if (projectValue.currentSubscriber.includes(userValue.id)) return res.status(400).json({ msg: 'User is already subscribed to this project' });

    const newValueUser = [...userValue.currentSubscibedProject, projectId];
    const updateExpression = "SET currentSubscibedProject = :currentSubscibedProject";
    const expressionAttributeValues = { ":currentSubscibedProject": newValueUser };
    await updateItem(email, process.env.USER_TABLE, updateExpression, expressionAttributeValues);

    const newValueProject = [...projectValue.currentSubscriber, userValue.id];
    const updateExpressionProject = "SET currentSubscriber = :currentSubscriber";
    const expressionAttributeValuesProject = { ":currentSubscriber": newValueProject };
    await updateItemProject(name, process.env.PROJECT_TABLE, updateExpressionProject, expressionAttributeValuesProject);

    res.status(200).json({ msg: 'Project subscribed' });
});