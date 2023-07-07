import * as React from "react";
import LandingPage from "../Landing Page/LandingPage";
import SelectRole from "../SelectRole/SelectRole";
import SelectSchool from "../SelectSchool/SelectSchool";
import Register from "../Register/Register";
import axios from 'axios'
import { useState } from "react";
import Login from "../Login/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useEffect } from "react";
import "./App.css";

export default function App() {
  const [error, setError] = useState('');
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    let schoolsList;
    
    
    
    const fetchSchools = async () => {
      try {
          const response = await axios.get(
            "https://parseapi.back4app.com/classes/Usuniversitieslist_University?&order=name",
            {
              headers: {
                "X-Parse-Application-Id":
                  "zmU5EWxwmKH1PAFE1rzjS7OIBbHu9AkHCluAvg1A", // This is your app's application id
                "X-Parse-REST-API-Key":
                  "7nlbgFrZGpAzwQ9laCtrSm25ioO1vgclGw86ajl2", // This is your app's REST API key
              },
            }
          );
          const data = response.data; // Here you have the data that you need
          console.log(data)
          schoolsList = data.results;
          console.log(schoolsList);
          const s=schoolsList.map((school) =>
          school.name
          )
          setSchools(s);
          setIsLoading(false);
          console.log(s)
          console.log(schoolsList)
        
      } catch (error) {
        setError('Sorry. No schools found')
        setIsLoading(false);
        console.log("Error:", error);
      }
    };
    fetchSchools();
  },[]);
  if (isLoading) {
    return <div>Loading...</div>; // Display a loading indicator while data is being fetched
  }else{
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pick_role" element={<SelectRole />} />
          <Route path="/pick_school" element={<SelectSchool schools={schools}/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
};