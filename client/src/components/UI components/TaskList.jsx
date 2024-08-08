import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks from the backend using Axios
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:1200/task/projectDetails');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4">
      {tasks.map((task) => (
        <div key={task.id} className="bg-gray-200 p-4 rounded shadow grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="font-semibold">Project Name:</span>
            <span>{task.projectName}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">Task Name:</span>
            <span>{task.taskName || 'N/A'}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">Due Date:</span>
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">Completion Percentage:</span>
            <span>{task.completionPercentage}%</span>
          </div>
          <div className="flex flex-col">
            <Link to={`/projectDetails/${task.id}`} className='bg-primary-100 text-white py-2 px-2 rounded-lg mb-2 hover:border-gray-300 mt-2 text-center' style={{textDecoration:"none"}}>
              
                View Details
            </Link>
          </div>
          <div className="flex flex-col">
            <button className="bg-primary-100 text-white py-2 px-2 rounded-lg mb-2 hover:border-gray-300 mt-2">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
