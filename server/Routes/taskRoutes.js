const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const Authorize = require('../middleware/authorization')
const createTask = require("../Controllers/taskController")

router.post('/tasks', createTask.createTask);
router.get('/details', createTask.getTeamMembers);




module.exports = router;
