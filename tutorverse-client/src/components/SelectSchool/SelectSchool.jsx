import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import "./SelectSchool.css";

export default function SelectSchool({ schools, setSchool }) {
  const handleChange = (event,value) => {
    setSchool(value);
  };

  
  if (!schools || schools.length === 0) {
    // Handle the case when schools data is not available
    return <div>Loading schools...</div>;
  }

  //List of universities
  const universities = [
    "Harvard University", 
    "Stanford University",
    "Massachusetts Institute of Technology", 
    "California Institute of Technology",
    "Princeton University", 
    "Yale University",
    "University of Chicago",
    "Columbia University", 
    "University of Pennsylvania", 
    "Northwestern University",
    "Berkeley",
    "University of California"
  ]

  return (
    <div>
      <Autocomplete
        disablePortal
        id="searchbox"
        options={universities}
        sx={{ width: 300 }}
        getOptionLabel={(option) => option}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField {...params} label="Select School" />
        )}
      />
      <div>
        <div>
          <h1>Find your school community</h1>
        </div>
        <div>
          <div className="school-searchbar"></div>
        </div>
        <div>
          <Link to={"/register"}>
            <button className="proceed-btn">Proceed</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
