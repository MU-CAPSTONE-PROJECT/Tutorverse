import * as React from "react";
import LandingPage from "../Landing Page/LandingPage";
import SelectRole from "../SelectRole/SelectRole";
import SelectSchool from "../SelectSchool/SelectSchool";
import Register from "../Register/Register";
import Login from "../Login/Login";
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <BrowserRouter>
        
        <Routes>
          
          <Route path='/' element={<LandingPage />}/>
          <Route path='/pick_role' element={<SelectRole/> }/>
          <Route path='/pick_school' element={<SelectSchool/> }/>
          <Route path='/register' element={<Register/>} />
          <Route path='/login' element={<Login/>}/>
          
        </Routes>
      </BrowserRouter>
 
    </div>
  );
}