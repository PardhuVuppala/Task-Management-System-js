import { useState } from 'react'
import './App.css'
import SignUp from './components/SignUp.jsx';
import Login from './components/login.jsx';
import DashBoard from './components/DashBoard.jsx';
import TaskForm from './components/TaskForm.jsx';

import { BrowserRouter, Routes, Route } from 'react-router-dom'
function App() {

  return (
    <div>
      <BrowserRouter>
      <Routes>
       <Route path="/signup" element={<SignUp/>} /> 
       <Route path='/' element={<Login/>}/>
       <Route path="/DashBoard" element={<DashBoard/>}/>
       <Route path="/taskForm" element={<TaskForm/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
