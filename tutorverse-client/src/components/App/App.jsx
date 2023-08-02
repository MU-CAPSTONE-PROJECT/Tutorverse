import LandingPage from "../Landing Page/LandingPage";
import SelectRole from "../SelectRole/SelectRole";
import SelectSchool from "../SelectSchool/SelectSchool";
import Register from "../Register/Register";
import axios from "axios";
import { useState } from "react";
import Login from "../Login/Login";
import Dashboard from "../Dashboard/Dashboard";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import ChatHome from "../ChatHome/ChatHome";
import { UserContext } from "../../../../userContext";
import TutorView from "../../../TutorView/TutorView";
import SelectCourses from "../SelectCourses/SelectCourses";
import TutorSubjects from "../TutorSubjects/TutorSubjects";
import TutorSchedule from "../TutorSchedule/TutorSchedule";

export default function App() {
  const [schools, setSchools] = useState([]); //State variable to store array of schools
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(""); //distinguish between tutor and student
  const [school, setSchool] = useState(null);
  const [coursesTaken, setCoursesTaken] = useState([]);
  const [coursesOffered, setCoursesOffered] = useState([]);

  const [user, setUser] = useState(() => {
    try {
      // Retrieve the user data from storage or set it to null if not found
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  });

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  useEffect(() => {
    // Save the user data to storage whenever the user state changes
    localStorage.setItem("user", JSON.stringify(user));

  }, [user]);

  const [schedule, setSchedule] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  useEffect(() => {
    let schoolsList;

    const fetchSchools = async () => {
      try {
        const response = await axios.get("http://localhost:3000/pick_uni", {
          withCredentials: true,
        }); //fetching schools list from server

        const data = response.data;
        schoolsList = data.results;

        //create an array of school names
        const s = schoolsList.map(
          (
            school, //make it a set to prevent duplicates
          ) => school.name,
        );
        setSchools(s);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log("Error:", error);
      }
    };
    fetchSchools();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading indicator while data is being fetched
  } else {
    return (
      <div className="app">
        <UserContext.Provider value={{ user, updateUser }}>
          <BrowserRouter>
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/pick_role"
                element={
                  <SelectRole userRole={userRole} setUserRole={setUserRole} />
                }
              />
              <Route
                path="/pick_school"
                element={
                  <SelectSchool
                    schools={schools}
                    school={school}
                    setSchool={setSchool}
                  />
                }
              />
              <Route
                path="/register"
                element={<Register school={school} userRole={userRole} coursesTaken={coursesTaken} coursesOffered={coursesOffered} schedule={schedule}/>}
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  user ? (
                    <Dashboard userInfo={user} userRole={userRole} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route path="/tutor/:tutorId" element={ user ? (<TutorView />) : (<Navigate to="/login" />)} />
              <Route path="/chat" element= { user ? (<ChatHome user={user}/>):(<Navigate to="/login" />)}/>
              <Route path="/chat/:tutorId" element = { user ? (<ChatHome user={user} />) : (<Navigate to="/login" />)}/>
              <Route path="/courses_taken" element = {<SelectCourses setCoursesTaken ={setCoursesTaken}/>}/>
              <Route path="/tutor_subjects" element={<TutorSubjects setCoursesOffered={setCoursesOffered} />}/>
              <Route path="/create_schedule" element={<TutorSchedule schedule={schedule} setSchedule={setSchedule}/>}/>
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
      </div>
    );
  }
}
