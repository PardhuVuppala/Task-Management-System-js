import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './UI components/sidebar';
import TaskList from './UI components/TaskList';
import ProjectDetailsList from './UI components/ProjectDetailsList';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const Navigate = useNavigate();
  const [loading, setLoading] = useState(true); 
  const [summary, setSummary] = useState({
    totalTasks: 0,
    incompleteTasks: 0
  });
  const [projectSummary, setProjectSummary] = useState({
    totalProjects: 0,
    incompleteProjects: 0
  });
  const [role, setRole] = useState("");
  const [projectDetails, setProjectDetails] = useState({
    totalProjects: 0,
    overdueProjects: 0
  });

  const [projectData, setProjectData] = useState({
    overdueProjects: 0,
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
  
    const verifyToken = async () => {
      try {
        const response = await axios.get("http://localhost:1200/user/is-verify", {
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });
        // Assuming setVerify is defined elsewhere
        // After token verification, fetch data
        fetchData();
      } catch (error) {
        console.error(error);
        Navigate("/");
      }
    };
  
    const fetchData = async () => {
      try {
        // Fetch project summary
        const summaryResponse = await axios.get('http://localhost:1200/task/data');
        setSummary(summaryResponse.data);
  
        // Fetch project details
        const detailsResponse = await axios.get('http://localhost:1200/task/projects/status');
        setProjectDetails(detailsResponse.data);
  
        // Fetch project summary for the user
        const userId = Cookies.get("user_id");
        const userSummaryResponse = await axios.get(`http://localhost:1200/task/user/tasks/${userId}`);
        setProjectSummary(userSummaryResponse.data);
  
        // Fetch project data for the user
        const userProjectDataResponse = await axios.get(`http://localhost:1200/task/user/duedate/${userId}`);
        setProjectData(userProjectDataResponse.data);
  
        // Set role from cookies
        setRole(Cookies.get("role"));
        
        // Set loading to false after fetching all data
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
        setLoading(false); // Set loading to false on error as well
      }
    };
  
    verifyToken();
  }, []);

  // While loading, show a loading indicator or skeleton UI
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex">
      
      <Sidebar className="fixed top-0 left-0 w-1/4 h-screen bg-gray-800 text-white" />
      <div className="ml-1/4 flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-200 p-4 rounded shadow">
            <h1 className="text-xl font-bold mb-4">Project Summary</h1>
            {role === "admin" ? (
              error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                <div>
                  <p><strong>Total Tasks:</strong> {summary.totalTasks}</p>
                  <p><strong>Incomplete Tasks:</strong> {summary.incompleteTasks}</p>
                </div>
              )
            ) : (
              error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                <div>
                  <p><strong>Total Projects:</strong> {projectSummary.totalProjects}</p>
                  <p><strong>Incomplete Projects:</strong> {projectSummary.incompleteProjects}</p>
                </div>
              )
            )}
          </div>
          <div className="bg-gray-200 p-4 rounded shadow">
            <h1 className="text-xl font-bold mb-4">Project Details</h1>
            
            {role === "admin" ? (
              error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                <div>
                   <p><strong>Total Projects:</strong> {projectDetails.totalProjects}</p>
                   <p><strong>Overdue Projects:</strong> {projectDetails.overdueProjects}</p>
                </div>
              )
            ) : (
              error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                <div>
                 <p><strong>Total Projects:</strong> {projectSummary.totalProjects}</p>
                 <p><strong>Overdue Projects:</strong> {projectData.overdueProjects}</p>
                </div>
              )
            )}
          </div>
          <div className="bg-gray-200 p-4 rounded shadow">05</div>
          <div className="p-4 rounded shadow col-span-3 row-span-5 max-h-[50rem] overflow-y-auto">
            <h1 className='text-xl font-bold mb-4 text-center'>Project Details</h1>
            {role === 'admin' ? <TaskList /> : <ProjectDetailsList />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
