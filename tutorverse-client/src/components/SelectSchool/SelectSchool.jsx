import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import "./SelectSchool.css";

export default function SelectSchool({schools, school, setSchool}) {

    const handleChange = (event)=>{
        setSchool(event.target.value);
    }

    //console.log(schools)
    if (!schools || schools.length === 0) {
        // Handle the case when schools data is not available
        return <div>Loading schools...</div>;
    }
    console.log(school);
    return (
        <div>
            <Autocomplete
                disablePortal
                id="searchbox"
                options={schools}
                sx={{ width: 300 }}
                value={school}
                //getOptionLabel={(option) => school}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} label="Select School" />}
            />

        <div>
            <div>
                <h1>Find your school community</h1>
            </div>
            <div>
                <div className="school-searchbar">

                    
                </div>
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
