const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const Authorize = require('../middleware/authorization')
const createTask = require("../Controllers/taskController")

router.post('/tasks', createTask.createTask);
router.get('/Trelloget/:id',createTask.getTaskForStoringTasks)
router.patch("/updateStatus/:taskId", createTask.updateTaskStatus);
router.get('/details', createTask.getTeamMembers);
router.get('/projectDetails', createTask.getAllTasks)
router.post('/create', createTask.AddTask);
router.get('/data',createTask.fetchProjectsSummary)
router.get('/projects/status', createTask.fetchProjectsStatus)
router.get('/user/projects/:userId', createTask.getUserProjects)
router.get('/user/tasks/:userId',createTask.getProjectSummary)
router.get('/user/duedate/:userId',createTask.getOverdueTasksCount)
router.get("/team/members/:taskId",createTask.getTeamMembersName)


module.exports = router;


