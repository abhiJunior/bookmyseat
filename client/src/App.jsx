import React from 'react'
import SignIn from './components/signIn'
import Home from './components/Home'
import Movielist from './components/Movielist'
import Show from './components/Show'
import Theatre from "./components/Theatre"
import ProtectedRoute from './components/ProtectedRoute'
import Admin from './components/Admin'
import Register from './components/Register'
import UserProfile from './components/UserProfile'
import Booking from './components/Booking'
import {Routes,Route} from "react-router-dom"
function App() {
  return (
    <>
      
      <Routes>
        <Route path='/' element={<ProtectedRoute><Home><Movielist/></Home></ProtectedRoute>}/>
        <Route path = "/movies/:movieId" element={<ProtectedRoute><Home><Theatre/></Home></ProtectedRoute>}/>
        <Route path='/show/:showId' element={<ProtectedRoute><Home><Show/></Home></ProtectedRoute>}/>
        <Route path='/login' element={<SignIn/>}/>
        <Route path='/signup' element= {<Register/>}/>
        <Route path='/profile' element={<ProtectedRoute><Home><UserProfile/></Home></ProtectedRoute>}/>
        <Route path='/admin' element={<ProtectedRoute><Home><Admin/></Home></ProtectedRoute>}/>
        <Route path='/booking' element={<ProtectedRoute><Home><Booking/></Home></ProtectedRoute>}/>
      </Routes>
      
    </>
  )
}

export default App
