
const TaskModel = require('../Models/TaskModel');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Controller to handle task creation




const getTeamMembers = async (req, res) => {
    try {
      const teamMembers = await prisma.userData.findMany({
        select: {
          id: true,
          first_name: true,
          role: true
        }
      });
      res.json(teamMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
      res.status(500).send('Error fetching team members');
    }
  };

  const createTask = async (req, res) => {
    try {
      const { userId, projectName, taskName, teamMembers, dueDate, completionPercentage, forStoringTasks } = req.body;
  
      // Create the task
      const newTask = await prisma.task.create({
        data: {
          userId,
          projectName,
          taskName: taskName || null, 
          teamMembers,
          dueDate: new Date(dueDate), 
          completionPercentage,
          forStoringTasks: forStoringTasks || {} 
        }
      });
  
      // Update the taskIds array for each user in teamMembers
      const teamMemberIds = Object.keys(teamMembers); // Extract user IDs from teamMembers object
  
      await Promise.all(
        teamMemberIds.map(async (memberId) => {
          await prisma.userData.update({
            where: { id: memberId },
            data: {
              taskIds: {
                push: newTask.id // Add the new task ID to the taskIds array
              }
            }
          });
        })
      );
  
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).send('Error creating task');
    }
  };
  

  const getAllTasks = async (req, res) => {
    try {
      const tasks = await prisma.task.findMany({
        select: {
          id: true,
          projectName: true,
          taskName: true,
          dueDate: true,
          completionPercentage: true
        }
      });
  
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).send('Error fetching tasks');
    }
  };
 
const getTaskForStoringTasks = async (req, res) => {
  const { id } = req.params; // Extracting taskId from params
  // console.log(id)
  try {
    // Ensure taskId is provided
    if (!id) {
      return res.status(400).send('Task ID is required');
    }

    const task = await prisma.task.findUnique({
      where: { id: id }, // Correctly using taskId
      select: { forStoringTasks: true } // Select only the forStoringTasks field
    });

    if (!task) {
      return res.status(404).send('Task not found');
    }

    res.json({ forStoringTasks: task.forStoringTasks, id: id });
    } catch (error) {
    console.error('Error fetching task forStoringTasks:', error);
    res.status(500).send('Error fetching task');
  }
};
const updateTaskStatus = async (req, res) => {
  const { taskId } = req.params; // Extract task ID from params
  const { taskName, newStatus } = req.body; // Extract task name and new status from request body

  try {
    // Ensure taskId, taskName, and newStatus are provided
    if (!taskId || !taskName || !newStatus) {
      return res.status(400).send('Task ID, task name, and new status are required');
    }

    // Fetch the task to verify it exists
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).send('Task not found');
    }

    // Assume forStoringTasks is already an object
    let forStoringTasks = task.forStoringTasks || {};
    const currentStatus = forStoringTasks[taskName];

    // Update the task's status
    if (currentStatus) {
      // Update the status in forStoringTasks
      forStoringTasks[taskName] = newStatus;

      // Calculate the percentage based on statuses
      const statusCounts = {
        pending: 0,
        doing: 0,
        completed: 0
      };

      // Count statuses
      for (const status of Object.values(forStoringTasks)) {
        if (statusCounts[status] !== undefined) {
          statusCounts[status]++;
        }
      }

      // Calculate the total number of tasks
      const totalTasks = Object.keys(forStoringTasks).length;

      // Calculate the completion percentage
      const completionPercentage = totalTasks === 0
        ? 0
        : Math.round((statusCounts.completed / totalTasks) * 100);

      // Update the task in the database
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          forStoringTasks, // Update the forStoringTasks field
          completionPercentage // Update the completionPercentage
        }
      });

      res.status(200).json(updatedTask);
    } else {
      res.status(404).send('Task name not found in forStoringTasks');
    }
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).send('Error updating task');
  }
};


const AddTask = async (req, res) => {
  const { id, name, status } = req.body;

  try {
    // Ensure id, name, and status are provided
    if (!id || !name || !status) {
      return res.status(400).send('Task ID, name, and status are required');
    }

    // Fetch the task to verify it exists
    const task = await prisma.task.findUnique({
      where: { id }
    });

    if (!task) {
      return res.status(404).send('Task not found');
    }

    // Initialize forStoringTasks if it doesn't exist
    const forStoringTasks = task.forStoringTasks || {};
    
    // Add the new task status to forStoringTasks
    forStoringTasks[name] = status;

    // Calculate the new completion percentage if needed
    const statusCounts = {
      pending: 0,
      doing: 0,
      completed: 0
    };

    // Count the statuses
    for (const taskStatus of Object.values(forStoringTasks)) {
      if (statusCounts[taskStatus] !== undefined) {
        statusCounts[taskStatus]++;
      }
    }

    // Calculate the total number of tasks
    const totalTasks = Object.keys(forStoringTasks).length;

    // Calculate the completion percentage
    const completionPercentage = totalTasks === 0
      ? 0
      : Math.round((statusCounts.completed / totalTasks) * 100);

    // Update the task in the database
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        forStoringTasks,
        completionPercentage // Update the completionPercentage if needed
      }
    });

    res.status(201).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).send('Error updating task');
  }
};



const fetchProjectsSummary = async (req, res) => {
  try {
    const projectsSummary = await TaskModel.getProjectSummary(); // Ensure the method name matches
    res.json(projectsSummary);
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).json({ error: 'Failed to fetch projects summary' });
  }
};



const fetchProjectsStatus = async (req, res) => {
  try {
    const projectsStatus = await TaskModel.getProjectsStatus();
    res.json(projectsStatus);
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).json({ error: 'Failed to fetch project status' });
  }
};


const getUserProjects = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user with the specified ID
    const user = await prisma.userData.findUnique({
      where: { id: userId },
      select: {
        taskIds: true
      }
    });

    // Check if the user exists and has task IDs
    if (!user || user.taskIds.length === 0) {
      return res.status(404).send('No tasks found for this user');
    }

    // Fetch tasks based on task IDs from the user
    const tasks = await prisma.task.findMany({
      where: {
        id: { in: user.taskIds }
      },
      select: {
        projectName: true,
        id: true,
        taskName: true,
        teamMembers: true,
        dueDate: true,
        completionPercentage: true
      }
    });

    // Respond with the tasks
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).send('Error fetching user projects');
  }
};

const getProjectSummary = async (req, res) => {
  const { userId } = req.params; // Get the userId from request parameters

  try {
    console.log(userId)
    // Fetch the user and their task IDs
    const user = await prisma.userData.findUnique({
      where: { id: userId },
      select: {
        taskIds: true
      }
    });

    if (!user) {
      return res.status(404).send('User not found');
    }

    const taskIds = user.taskIds;

    // Fetch tasks using the task IDs
    const tasks = await prisma.task.findMany({
      where: {
        id: { in: taskIds }
      }
    });

    // Calculate total projects and incomplete projects
    const totalProjects = new Set();
    let incompleteProjects = 0;

    tasks.forEach(task => {
      totalProjects.add(task.projectName); // Collect unique project names

      if (task.completionPercentage < 100) {
        incompleteProjects++;
      }
    });

    res.status(200).json({
      totalProjects: totalProjects.size,
      incompleteProjects
    });
  } catch (error) {
    console.error('Error fetching project summary:', error);
    res.status(500).send('Error fetching project summary');
  }
};


const getOverdueTasksCount = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the user including task IDs
    const user = await prisma.userData.findUnique({
      where: { id: userId },
      select: { taskIds: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch tasks based on task IDs from the user
    const overdueTasksCount = await prisma.task.count({
      where: {
        id: { in: user.taskIds }, // Verify against taskIds in the UserData model
        dueDate: { lt: new Date() }, // Due date has passed
        completionPercentage: { lt: 100 }, // Task is not 100% complete
      },
    });

    // Send the response
    res.json({
      overdueProjects: overdueTasksCount, // Number of overdue tasks
    });

  } catch (error) {
    console.error('Error fetching overdue tasks count:', error);
    res.status(500).json({ error: 'Failed to fetch overdue tasks count' });
  }
};

const getTeamMembersName = async (req, res) => {
  const { taskId } = req.params;

  try {
    // Fetch the task to get the teamMembers JSON object
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { teamMembers: true },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const teamMembers = task.teamMembers;
    const teamMemberIds = Object.keys(teamMembers);

    if (teamMemberIds.length === 0) {
      return res.status(404).json({ error: 'No team members found for this task' });
    }

    // Fetch user details based on team member IDs
    const users = await prisma.userData.findMany({
      where: {
        id: { in: teamMemberIds },
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    });

    // Map user data by ID
    const userMap = users.reduce((acc, user) => {
      acc[user.id] = {
        Name: user.first_name +" " + user.last_name,
        email: user.email,
      };
      return acc;
    }, {});

    // Send the user data back
    res.json(userMap);

  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
};


module.exports = { createTask, getTeamMembers, getAllTasks,getTaskForStoringTasks,updateTaskStatus,AddTask, fetchProjectsSummary,fetchProjectsStatus,getUserProjects ,getProjectSummary,getOverdueTasksCount, getTeamMembersName};
