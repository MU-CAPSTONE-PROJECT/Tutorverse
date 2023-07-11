import * as React from "react";
import LandingPage from "../Landing Page/LandingPage";
import SelectRole from "../SelectRole/SelectRole";
import SelectSchool from "../SelectSchool/SelectSchool";
import Register from "../Register/Register";
import axios from 'axios'
import { useState } from "react";
import Login from "../Login/Login";
import Dashboard from "../Dashboard/Dashboard";
import { BrowserRouter, Routes, Route , useNavigate} from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import { UserContext } from "../../../../userContext";


export default function App() {
  const [error, setError] = useState('');
  const [schools, setSchools] = useState([]);  //State variable to store array of schools
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState('') //distinguish between tutor and student

  const [user, setUser] = useState(() => {
    // Retrieve the user data from storage or set it to null if not found
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  useEffect(() => {

    // Save the user data to storage whenever the user state changes
    localStorage.setItem('user', JSON.stringify(user));

    let schoolsList;
   
    const fetchSchools = async () => {
      try {
          const response = await axios.get(
            "http://localhost:3000/pick_uni",
            {
              withCredentials:true
            }); //fetching schools list from server

          const data = response.data; 
          schoolsList = data.results;

          //create an array of school names
          const s = schoolsList.map((school) =>  //make it a set to prevent duplicates
          school.name
          )
          setSchools(s);
          setIsLoading(false);
        
      } catch (error) {
        setError('Sorry. No schools found')
        setIsLoading(false);
        console.log("Error:", error);
      }
    };
    fetchSchools();
  },[user]);


  if (isLoading) {
    return <div>Loading...</div>; // Display a loading indicator while data is being fetched
  }else{
  return (
    <div className="app">
      <UserContext.Provider value = {{user, updateUser}}>

        <BrowserRouter>
          <Routes location={location} >
            <Route path="/" element={<LandingPage />} />
            <Route path="/pick_role" element={<SelectRole 
              userRole={userRole}  
              setUserRole={setUserRole}
            />} />
            <Route path="/pick_school" element={<SelectSchool schools={schools}/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={ user ? <Dashboard userInfo={user} userRole={userRole} /> :<Login/>}/>
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
      
    </div>
  );
}
};