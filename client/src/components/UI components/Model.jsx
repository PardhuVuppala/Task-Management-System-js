import React from 'react';

const Modal = ({ isOpen, onClose, teamMembers }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Team Members</h2>
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        <ul>
          {Object.entries(teamMembers).map(([id, member]) => (
            <li key={id} className="mb-2">
              <p><strong>Name:</strong> {member.Name}</p>
              <p><strong>Email:</strong> {member.email}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Modal;
