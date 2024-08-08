import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";

const ProjectDetailsList = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    // Fetch project details from the backend using Axios
    const fetchProjects = async () => {
      try {
        const userId = Cookies.get("user_id");
        const response = await axios.get(`http://localhost:1200/task/user/projects/${userId}`); // Update URL if needed
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleViewTeamMembers = async (projectId) => {
    try {
      const response = await axios.get(`http://localhost:1200/task/team/members/${projectId}`);
      setTeamMembers(Object.values(response.data)); // Convert object to array
      setSelectedProjectId(projectId);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setTeamMembers([]);
  };

  return (
    <div className="relative">
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
              <Link to={`/projectDetails/${project.id}`} className='bg-primary-100 text-white py-2 px-2 rounded-lg mb-2 hover:border-gray-300 mt-2 text-center' style={{ textDecoration: "none" }}>
                View Details
              </Link>
            </div>
            <div className="flex flex-col">
              <button type="button" onClick={() => handleViewTeamMembers(project.id)} className="bg-primary-100 text-white py-2 px-2 rounded-lg mb-2 hover:border-gray-300 mt-2">
                View Team Members
              </button>
            </div>
            <div className="flex flex-col">
            </div>
          </div>
        ))}
      </div>

      {/* Modal for displaying team members */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-bold mb-4">Team Members</h2>
            <ul className="list-disc pl-5">
              {teamMembers.length > 0 ? (
                teamMembers.map((member, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-semibold">{member.Name}:</span> {member.email}
                  </li>
                ))
              ) : (
                <li>No team members found.</li>
              )}
            </ul>
            <button type="button" onClick={closeModal} className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsList;
