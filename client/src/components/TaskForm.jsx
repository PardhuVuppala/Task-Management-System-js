import React, { useState, useEffect } from 'react';
const TaskForm = () => {
  const [formData, setFormData] = useState({
    userId: '',
    projectName: '',
    taskName: '', // Optional field
    teamMembers: [],
    dueDate: '',
    completionPercentage: ''
  });

  const [availableTeamMembers, setAvailableTeamMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch team members from the backend
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('http://localhost:1200/api/team-members');
        const data = await response.json();
        console.log(data);
        setAvailableTeamMembers(data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTeamMemberChange = (e, memberId) => {
    const { checked } = e.target;
    setSelectedMembers(prev => ({
      ...prev,
      [memberId]: checked ? 'Developer' : '' // Adjust role as needed
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:1200/task/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: formData.userId,
          projectName: formData.projectName,
          taskName: formData.taskName || null, // Handle optional taskName
          teamMembers: selectedMembers,
          dueDate: new Date(formData.dueDate).toISOString(),
          completionPercentage: parseInt(formData.completionPercentage, 10),
          // 'forStoringTasks' field is not included
        })
      });

      if (response.ok) {
        alert('Task created successfully!');
        setFormData({
          userId: '',
          projectName: '',
          taskName: '', // Reset optional field
          teamMembers: [],
          dueDate: '',
          completionPercentage: ''
          // 'forStoringTasks' field is not included
        });
        setSelectedMembers({});
        setIsModalOpen(false); // Close the modal on success
      } else {
        alert('Failed to create task');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the task');
    }
  };

  const filteredTeamMembers = availableTeamMembers.filter(member =>
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Open Task Form
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700">User ID</label>
                <input
                  type="text"
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">Project Name</label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">Task Name (Optional)</label>
                <input
                  type="text"
                  id="taskName"
                  name="taskName"
                  value={formData.taskName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label htmlFor="completionPercentage" className="block text-sm font-medium text-gray-700">Completion Percentage</label>
                <input
                  type="number"
                  id="completionPercentage"
                  name="completionPercentage"
                  value={formData.completionPercentage}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label htmlFor="teamMembersSearch" className="block text-sm font-medium text-gray-700">Search by Role</label>
                <input
                  type="text"
                  id="teamMembersSearch"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="max-h-40 overflow-y-auto">
                <label className="block text-sm font-medium text-gray-700">Team Members</label>
                <div className="space-y-2">
                  {filteredTeamMembers.map(member => (
                    <div key={member.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`member-${member.id}`}
                        checked={!!selectedMembers[member.id]}
                        onChange={(e) => handleTeamMemberChange(e, member.id)}
                        className="mr-2"
                      />
                      <label htmlFor={`member-${member.id}`} className="text-sm text-gray-600">
                        {member.first_name} {/* Show only member's first_name */}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskForm;
