const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProjectSummary = async () => {
  try {
    const totalTasksCount = await prisma.task.count();
    const incompleteTasksCount = await prisma.task.count({
      where: {
        completionPercentage: {
          lt: 100, 
        },
      },
    });
    return {
      totalTasks: totalTasksCount,
      incompleteTasks: incompleteTasksCount
    };
  } catch (error) {
    console.error('Error fetching project summary:', error);
    throw error;
  }
};

const getProjectsStatus = async () => {
  try {
    // Get the total number of unique projects
    const totalProjects = await prisma.task.groupBy({
      by: ['projectName'],
      _count: {
        id: true,
      },
    });

    const totalProjectsCount = await prisma.task.count();

    // Get the number of unique projects with overdue tasks
    const overdueProjects = await prisma.task.findMany({
      where: {
        dueDate: {
          lt: new Date(), // Compare with current date
        },
      },
      select: {
        projectName: true,
      },
      distinct: ['projectName'],
    });

    const overdueProjectsCount = new Set(overdueProjects.map(p => p.projectName)).size;

    return {
      totalProjects: totalProjectsCount,
      overdueProjects: overdueProjectsCount
    };
  } catch (error) {
    console.error('Error fetching project status:', error);
    throw error;
  }
};

module.exports = {
  getProjectSummary,getProjectsStatus
};
