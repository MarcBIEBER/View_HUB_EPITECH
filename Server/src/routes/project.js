const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { getAllTable, addItemAtTable, deleteItem } = require('../DataBase/request');
const { getUser, updateItem } = require('../DataBase/requestUser');
const { getProject, updateItemProject, getUserSubscribedToProject } = require('../DataBase/requestProject');
const { verifyAccessToken, verifyTokenForDelete } = require('../auth');

router.use(cors());
module.exports = router;

router.get('/api/v1/getProjects', async (req, res) => {
    const projects = await getAllTable(process.env.PROJECT_TABLE);
    res.status(200).json(projects);
});

router.post('/api/v1/createProject', verifyAccessToken, async (req, res) => {
    // TODO: check here if the name is already taken
    const { name, description, owner, type, tag } = req.body;
    const newProject = {
        name: name,
        description: description,
        date: new Date().toISOString(),
        owner: owner,
        type: type,
        tag: tag,
        currentSubscriber: []
    };
    if (!newProject.name || !newProject.description || !newProject.owner || !newProject.type || !newProject.tag) {
        return res.status(400).json({ msg: 'Please include a name, description, type, tag and owner' });
    }

    addItemAtTable(newProject, process.env.PROJECT_TABLE);
    res.status(200).json(newProject);
});

router.delete('/api/v1/deleteProject', async (req, res) => {
    const name = req.query.name;
    const owner = req.query.email;
    const token = req.query.token;
    
    if (!name || !owner) return res.status(400).json({ msg: 'Please include a name and owner' });
    
    const verifyToken = verifyTokenForDelete(token, owner);
    if (verifyToken == false) return res.status(401).json({ msg: 'Unauthorized' });
    
    const project = await getProject(name);
    if (!project) return res.status(400).json({ msg: 'Project not found' });

    const deletedProject = await deleteItem(process.env.PROJECT_TABLE, name);
    if (!deletedProject) return res.status(500).json({ msg: 'Failed to delete project' });

    res.status(200).json({ msg: 'Project deleted' });
});

router.post("/api/v1/subscribeToProject", verifyAccessToken, async (req, res) => {
    const { email, projectName } = req.body;
    if (!email || !projectName) return res.status(400).json({ msg: 'Please include an email and project name' });

    const userValue = await getUser(email);
    if (userValue.currentSubscibedProject.includes(projectName)) return res.status(400).json({ msg: 'User is already subscribed to this project' });

    const projectValue = await getProject(projectName);
    if (projectValue.currentSubscriber.includes(userValue.name)) return res.status(400).json({ msg: 'User is already subscribed to this project' });

    const newValueUser = [...userValue.currentSubscibedProject, projectName];
    const updateExpression = "SET currentSubscibedProject = :currentSubscibedProject";
    const expressionAttributeValues = { ":currentSubscibedProject": newValueUser };
    await updateItem(email, process.env.USER_TABLE, updateExpression, expressionAttributeValues);

    const newValueProject = [...projectValue.currentSubscriber, userValue.email];
    const updateExpressionProject = "SET currentSubscriber = :currentSubscriber";
    const expressionAttributeValuesProject = { ":currentSubscriber": newValueProject };

    await updateItemProject(projectName, process.env.PROJECT_TABLE, updateExpressionProject, expressionAttributeValuesProject);

    res.status(200).json({ msg: 'Project subscribed' });
});

router.post("/api/v1/unsubscribeToProject", verifyAccessToken, async (req, res) => {
    const { projectName, email } = req.body;
    
    if (!projectName || !email) return res.status(400).json({ msg: 'Please include a project name and email' });

    const userValue = await getUser(email);
    if (!userValue.currentSubscibedProject.includes(projectName)) return res.status(400).json({ msg: 'User is not subscribed to this project' });

    const projectValue = await getProject(projectName);
    if (!projectValue.currentSubscriber.includes(userValue.email)) return res.status(400).json({ msg: 'User is not subscribed to this project' });

    const newValueUser = userValue.currentSubscibedProject.filter((project) => project !== projectName);
    const updateExpression = "SET currentSubscibedProject = :currentSubscibedProject";
    const expressionAttributeValues = { ":currentSubscibedProject": newValueUser };
    await updateItem(email, process.env.USER_TABLE, updateExpression, expressionAttributeValues);

    const newValueProject = projectValue.currentSubscriber.filter((user) => user !== userValue.email);
    const updateExpressionProject = "SET currentSubscriber = :currentSubscriber";
    const expressionAttributeValuesProject = { ":currentSubscriber": newValueProject };

    await updateItemProject(projectName, process.env.PROJECT_TABLE, updateExpressionProject, expressionAttributeValuesProject);

    res.status(200).json({ msg: 'Project unsubscribed' });
});

router.get("/api/v1/getSubscribers", async (req, res) => {
    const name = req.query.name;
    if (!name) return res.status(400).json({ msg: 'Please include a name' });

    const project = await getProject(name);
    if (!project) return res.status(400).json({ msg: 'Project not found' });

    res.status(200).json(project.currentSubscriber);
});