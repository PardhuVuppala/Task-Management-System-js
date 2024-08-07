import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from "js-cookie"

const ProjectDetails = () => {
  const [tasks, setTasks] = useState({
    doing: [],
    pending: [],
    completed: []
  });

  const [taskId, setTaskId] = useState('');
  const [newTaskName, setNewTaskName] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:1200/task/Trelloget/cb3da067-1750-46f1-80a3-12f6ccddd578');
        const { forStoringTasks, id } = response.data;
        Cookies.set("taskId", id) 
        setTaskId(id);

        const categorizedTasks = { doing: [], pending: [], completed: [] };
        Object.entries(forStoringTasks).forEach(([name, status]) => {
          if (categorizedTasks[status]) {
            categorizedTasks[status].push({ id: taskId, name });
          }
        });

        setTasks(categorizedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleChangeStatus = async (taskId, taskName, currentStatus, newStatus) => {

    try {
      console.log(taskName)
      console.log(newStatus)
      console.log(currentStatus)
      taskId = Cookies.get("taskId")

      await axios.patch(`http://localhost:1200/task/updateStatus/${taskId}`, { taskName, newStatus });
  
      // Update local state after successful status change
      const updatedTasks = { ...tasks };
      const task = updatedTasks[currentStatus].find(t => t.name === taskName);
      updatedTasks[currentStatus] = updatedTasks[currentStatus].filter(t => t.name !== taskName);
  
      // Update task status
      task.status = newStatus;
      updatedTasks[newStatus].push(task);
  
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  

  const handleAddTask = async () => {
    if (newTaskName.trim()) {
      const newTask = {
        id: taskId, // For production, use a unique ID generator
        name: newTaskName,
        status: 'pending'
      };

      try {
        console.log(newTask)

        // Create new task in backend
        await axios.post('http://localhost:1200/task/create', { ...newTask });
        
        // Update local state with the new task
        setTasks(prevTasks => ({
          ...prevTasks,
          pending: [...prevTasks.pending, newTask]
        }));
        setNewTaskName(''); // Clear input field
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex space-x-4">
        {['doing', 'pending', 'completed'].map(status => (
          <div key={status} className="flex-1 bg-gray-100 p-4 rounded-lg shadow-md h-80">
            <h2 className="text-lg font-bold mb-4 capitalize">{status}</h2>
            <div className="space-y-2">
              {tasks[status].map(task => (
                <div key={task.name} className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm">
                  <span>{task.name}</span>
                  {status !== 'completed' && (
                    <select
                      value={task.status}
                      onChange={(e) => handleChangeStatus(task.id, task.name, status, e.target.value)}
                      className="border border-gray-300 rounded-md p-1"
                    >
                      <option value="doing">Doing</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  )}
                </div>
              ))}
              {status === 'pending' && (
                <div className="mt-4">
                  <input
                    type="text"
                    value={newTaskName}
                    placeholder="New task name"
                    className="border border-gray-300 rounded-md p-2 w-full"
                    onChange={(e) => setNewTaskName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddTask();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddTask}
                    className="mt-2 bg-blue-500 text-white p-2 rounded-md w-full"
                  >
                    Add New Task
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetails;
