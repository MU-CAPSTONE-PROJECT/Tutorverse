import { Link , useNavigate} from "react-router-dom";
import TextField from "@mui/material/TextField";
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from "@mui/material/Autocomplete";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import "./SelectSchool.css";


export default function SelectSchool({ schools, setSchool }) {
   const navigate = useNavigate();

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

  const handleNextClick = () => {
    navigate('/register')
  }

  return (
    <div className="content">
      <div>
          <h1>Find your school community</h1>
      </div>

      <div className="search">

        <Autocomplete
        disablePortal
        id="searchbox"
        options={universities}
        
        sx={{ position: 'center', justifyContent: 'center'}}
        getOptionLabel={(option) => option}
        onChange={handleChange}
        className="autocompleteContainer"
        renderInput={(params) => (
          <TextField
            {...params}
            id="textfield"
            label="Select School"
            className="autocompleteInput"
            sx={{
              border: '2px solid #F59525',
              borderRadius: '50px',
              color: '#fff', 
              "&.Mui-focused": {
                border: '2px solid #F59525',
                borderColor: '#F59525',
                backgroundColor: 'transparent',
              },
            }}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <SearchIcon sx={{ color: '#F59525' }} /> {/* Icon color */}
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
          />
        )}
      />
      </div>
      
      <div>
        <div onClick={handleNextClick}>
          <div><br></br>Proceed </div>
          <ArrowForwardIcon sx={{fontSize: 50, color:'#F59525'}}/>
        </div>
      </div>
    </div>
  );
}
