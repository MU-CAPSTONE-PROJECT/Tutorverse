import './TutorSubjects.css'
import Select from "@mui/material/Select";
import { useState } from 'react';
import MenuItem from "@mui/material/MenuItem";
import { Box, Chip , OutlinedInput, FormControl, InputLabel, Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function TutorSubjects({setCoursesOffered}){
    const [selectedSubjects, setSelectedSubjects]  = useState([])
    const navigate = useNavigate();

    const availableSubjects = [
        "Math",
        "Biology",
        "Chemistry",
        "Physics",
        "Microbiology",
        "Biochemistry",
        "Writing",
        "Environmental Science",
        "Language Arts",
        "Languages",
        "History",
        "Test Prep",
        "Programming",
        "Arts",
        "Business",
        "Wellness",
        "Engineering",
        "Music",
        "Social Sciences",
        "Cultural Studies",
        "Health",
        "Technology",
        "Visual Arts",
        "Economics",
        "Physical Education"
      ];
      
      const handleChange = (event) => {
        setSelectedSubjects(event.target.value);
    };
    
    const handleNextBtn = async () => {
        if(!(selectedSubjects.length===0)){
            setCoursesOffered(selectedSubjects)
            navigate('/create_schedule')
        }
        else if(selectedSubjects.length===0){
            alert("Please make a selection")
        }
    }
    
    return(
        <div>
            <h2>Select your tutoring area(s)</h2>
            <div>
            <FormControl>
                 <InputLabel >Courses</InputLabel>
                <Select
                multiple
                value={selectedSubjects}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 , backgroundColor: '#ffffff'}}>
                    {selected.map((value) => (
                        <Chip key={value} label={value}  />
                    ))}
                    </Box>
                )}>

                {availableSubjects.map((course) => (
                    <MenuItem key={course} value={course}>
                    {course}
                    </MenuItem>

                ))}
                </Select>
            </FormControl>
            
            </div>

            <Button onClick={handleNextBtn}>
                Next
            </Button>
    </div>
    )
}