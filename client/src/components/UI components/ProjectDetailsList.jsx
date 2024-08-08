import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from "js-cookie"
const ProjectDetailsList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch project details from the backend using Axios
    const fetchProjects = async () => {
      try {
         const userId = Cookies.get("user_id")
        const response = await axios.get(`http://localhost:1200/task/user/projects/${userId}`); // Update the URL if needed
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4">
      {projects.map((project) => (
        <div key={project.id} className="bg-gray-200 p-4 rounded shadow grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="font-semibold">Project Name:</span>
            <span>{project.projectName}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">Task Name:</span>
            <span>{project.taskName || 'N/A'}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">Due Date:</span>
            <span>{new Date(project.dueDate).toLocaleDateString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">Completion Percentage:</span>
            <span>{project.completionPercentage}%</span>
          </div>
          <div className="flex flex-col">
            <Link to={`/projectDetails/${project.id}`} className='bg-primary-100 text-white py-2 px-2 rounded-lg mb-2 hover:border-gray-300 mt-2 text-center' style={{textDecoration:"none"}}>
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

export default ProjectDetailsList;
