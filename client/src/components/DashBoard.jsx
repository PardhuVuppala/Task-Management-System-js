import React, { useEffect, useState } from 'react';
import Sidebar from './UI components/sidebar';
import TaskList from './UI components/TaskList';

function DashBoard() {
  
  return (
    <div className='flex'>
      <Sidebar className="w-1/3" />
      <div className="flex-1 p-4 grid grid-cols-3 gap-4">
        <div className="bg-gray-200 p-4 rounded shadow">01</div>
        <div className="bg-gray-200 p-4 rounded shadow">05</div>
        <div className="bg-gray-200 p-4 rounded shadow">05</div>
        <div className=" p-4 rounded shadow col-span-3 row-span-5">
          <div className=" h-full">
          <TaskList/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
