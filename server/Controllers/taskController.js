

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
    const forStoringTasks = task.forStoringTasks;
    const currentStatus = forStoringTasks[taskName];

    // Update the task's status
    if (currentStatus) {
      forStoringTasks[taskName] = newStatus;

      // Update the task in the database
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          forStoringTasks // No need to stringify if it's already an object
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
    // Fetch the task to verify it exists
    const task = await prisma.task.findUnique({
      where: { id }
    });

    if (!task) {
      return res.status(404).send('Task not found');
    }

    // Assume forStoringTasks is already an object
    const forStoringTasks = task.forStoringTasks;
    forStoringTasks[name] = status;

    // Update the task in the database
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        forStoringTasks // No need to stringify if it's already an object
      }
    });

    res.status(201).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).send('Error updating task');
  }
};




  

module.exports = { createTask, getTeamMembers, getAllTasks,getTaskForStoringTasks,updateTaskStatus,AddTask };
