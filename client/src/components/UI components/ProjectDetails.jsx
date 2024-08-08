import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ProjectDetails = () => {
  const { taskId } = useParams();
  const [tasks, setTasks] = useState({
    doing: [],
    pending: [],
    completed: []
  });
  const Navigate = useNavigate("/");
  const [newTaskName, setNewTaskName] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:1200/task/Trelloget/${taskId}`);
        const { forStoringTasks, id } = response.data;
       

        const categorizedTasks = { doing: [], pending: [], completed: [] };
        Object.entries(forStoringTasks).forEach(([name, status]) => {
          if (categorizedTasks[status]) {
            categorizedTasks[status].push({ id: taskId, name, status });
          }
        });

        setTasks(categorizedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [taskId]);

  const handleChangeStatus = async (taskId, taskName, currentStatus, newStatus) => {
    try {
      await axios.patch(`http://localhost:1200/task/updateStatus/${taskId}`, { taskName, newStatus });

      const updatedTasks = { ...tasks };
      const task = updatedTasks[currentStatus].find(t => t.name === taskName);
      updatedTasks[currentStatus] = updatedTasks[currentStatus].filter(t => t.name !== taskName);

      task.status = newStatus;
      updatedTasks[newStatus].push(task);

      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  const Back=()=>{
     Navigate('/DashBoard')
  }

  const handleAddTask = async () => {
    if (newTaskName.trim()) {
      const newTask = {
        id: taskId,
        name: newTaskName,
        status: 'pending'
      };

      try {
        await axios.post('http://localhost:1200/task/create', { ...newTask });

        setTasks(prevTasks => ({
          ...prevTasks,
          pending: [...prevTasks.pending, newTask]
        }));
        setNewTaskName('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  return (
    <div>
  

      <button className="fixed top-4 left-4 bg-primary-100 text-white rounded-full p-3 shadow-lg focus:ring-opacity-50" onClick={Back}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
</svg>
  </button>
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-7xl">
        <div className="flex space-x-4">
          {['pending', 'doing', 'completed'].map(status => (
            <div key={status} className="flex-1 bg-gray-100 p-4 rounded-lg shadow-md h-96 overflow-y-auto">
              <h2 className="text-lg font-bold mb-4 capitalize">{status}</h2>
              <div className="space-y-2">
                {tasks[status].map(task => (
                  <div key={task.name} className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm">
                    <span className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm">{task.name}</span>
                    {status !== 'completed' && (
                      <select
                        value={task.status}
                        onChange={(e) => handleChangeStatus(task.id, task.name, status, e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
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
                      className="block w-full mt-1.5 rounded-md box-border border-0 pl-2 bg-textbg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={(e) => setNewTaskName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddTask();
                        }
                      }}
                    />
                    <button
                      onClick={handleAddTask}
                      className="w-full bg-primary-100 text-white py-2 px-5 rounded-lg mb-2 hover:border-gray-300 mt-2 "
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
    </div>
    </div>
  );
};

export default ProjectDetails;
