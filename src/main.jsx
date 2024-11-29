import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Signup from './pages/Signup'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Signin from './pages/Signin'
import Home from './pages/Home'
import Barbershop from './pages/Barbeshop'
import Details_barber from './pages/Details_Barber'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/barbershops" element={<Barbershop/>}/>
        <Route path="/barbershops/:id" element={<Details_barber/>}/>
      </Routes>
    </Router>
  </React.StrictMode>
)
