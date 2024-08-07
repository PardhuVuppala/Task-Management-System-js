import React, { useEffect, useState } from 'react';
import Sidebar from './UI components/sidebar';

function DashBoard() {
  
  return (
    <div className='flex'>
      <Sidebar className="w-1/3" />
      <div className="flex-1 p-4 grid grid-cols-3 gap-4">
        <div className="bg-gray-200 p-4 rounded shadow">01</div>
        <div className="bg-gray-200 p-4 rounded shadow">05</div>
        <div className="bg-gray-200 p-4 rounded shadow">05</div>
        <div className="bg-gray-200 p-4 rounded shadow col-span-3 row-span-5">
          <div className="flex items-center justify-center h-full">06</div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
