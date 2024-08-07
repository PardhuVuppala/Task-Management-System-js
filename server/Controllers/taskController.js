

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Controller to handle task creation




const getTeamMembers = async (req, res) => {
    try {
      // Fetch team members from the database
      const teamMembers = await prisma.userData.findMany({
        select: {
          id: true,
          first_name: true,
          role: true
        }
      });
  
      // Return the list of team members
    //   console.log(teamMembers)
      res.json(teamMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
      res.status(500).send('Error fetching team members');
    }
  };


const createTask = async (req, res) => {
    try {
      const { userId, projectName, taskName, teamMembers, dueDate, completionPercentage, forStoringTasks } = req.body;
  
      // Create a new task using Prisma
      const newTask = await prisma.task.create({
        data: {
          userId,
          projectName,
          taskName: taskName || null, // Use null if taskName is not provided
          teamMembers,
          dueDate: new Date(dueDate), // Ensure dueDate is in Date format
          completionPercentage,
          forStoringTasks: forStoringTasks || {} // Use an empty object if forStoringTasks is not provided
        }
      });
  
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).send('Error creating task');
    }
  };

module.exports = { createTask, getTeamMembers };
