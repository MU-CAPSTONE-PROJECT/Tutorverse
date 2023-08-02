import './SelectCourses.css'
import Select from "@mui/material/Select";
import { useState } from 'react';
import MenuItem from "@mui/material/MenuItem";
import { Box, Chip , OutlinedInput, FormControl, InputLabel, Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';


export default function SelectCourses({setCoursesTaken}){
    const navigate = useNavigate();
    const [selectedCourses, setSelectedCourses] = useState([]);

    const availableCourses = [
        "3D Animation",
        "Abnormal Psychology",
        "Acting Workshop",
        "Aerodynamics",
        "African History",
        "Agricultural Economics",
        "Algebraic Geometry",
        "American Literature",
        "Anatomy and Physiology",
        "Ancient Greek",
        "Animal Behavior",
        "Anthropology of Religion",
        "Applied Ethics",
        "Applied Linguistics",
        "Applied Statistics",
        "Aquatic Ecology",
        "Archaeological Methods",
        "Architectural Design",
        "Art History",
        "Artificial Intelligence",
        "Asian Politics",
        "Astrophysics",
        "Behavioral Neuroscience",
        "Biochemistry",
        "Bioethics",
        "Biogeography",
        "Biological Illustration",
        "Biological Psychology",
        "Biomechanics",
        "Biomedical Engineering",
        "Business Law",
        "Calculus I",
        "Calculus II",
        "Cell Biology",
        "Chemical Engineering",
        "Child Development",
        "Cinematography",
        "Civil Engineering",
        "Classical Mythology",
        "Cognitive Psychology",
        "College Algebra",
        "Communication Theory",
        "Comparative Literature",
        "Computer Graphics",
        "Computer Networks",
        "Conceptual Physics",
        "Conflict Resolution",
        "Consumer Behavior",
        "Contemporary Art",
        "Control Systems Engineering",
        "Corporate Finance",
        "Criminal Justice",
        "Cultural Anthropology",
        "Cybersecurity",
        "Dance History",
        "Data Analytics",
        "Database Management",
        "Deep Learning",
        "Development Economics",
        "Developmental Psychology",
        "Digital Marketing",
        "Differential Equations",
        "Digital Photography",
        "Discrete Mathematics",
        "Earth Science",
        "Ecological Economics",
        "Econometrics",
        "Economic Geography",
        "Educational Psychology",
        "Electric Circuits",
        "Electromagnetism",
        "Energy Policy",
        "Engineering Ethics",
        "Entrepreneurship",
        "Environmental Ethics",
        "Environmental Geology",
        "Environmental Science",
        "Epidemiology",
        "European History",
        "Evolutionary Biology",
        "Experimental Physics",
        "Fashion Design",
        "Film Production",
        "Financial Accounting",
        "Financial Management",
        "Fine Arts",
        "Fluid Dynamics",
        "Food Chemistry",
        "Foreign Policy Analysis",
        "French Literature",
        "Game Design",
        "Gender Studies",
        "Genetic Engineering",
        "Geographic Information Systems",
        "Geopolitics",
        "German Language and Culture",
        "Global Health",
        "Greek Mythology",
        "Healthcare Management",
        "History of Architecture",
        "Human Anatomy",
        "Human Nutrition",
        "Immunology",
        "Industrial Design",
        "Information Systems",
        "Inorganic Chemistry",
        "International Business",
        "International Law",
        "Introduction to Astronomy",
        "Introduction to Buddhism",
        "Introduction to Computing",
        "Introduction to Criminology",
        "Introduction to Film Studies",
        "Introduction to Logic",
        "Introduction to Music Theory",
        "Introduction to Philosophy",
        "Introduction to Psychology",
        "Introduction to Sociology",
        "Islamic Art and Architecture",
        "Italian Renaissance",
        "Japanese Language",
        "Journalism Ethics",
        "Labor Economics",
        "Landscape Architecture",
        "Latin American Literature",
        "Law and Society",
        "Machine Learning",
        "Macroeconomics",
        "Marine Biology",
        "Marketing Research",
        "Materials Science",
        "Mathematical Logic",
        "Mechanical Engineering",
        "Medieval History",
        "Microbiology",
        "Microeconomics",
        "Modern Dance",
        "Molecular Biology",
        "Multivariable Calculus",
        "Museum Studies",
        "Music Composition",
        "Music History",
        "Nanotechnology",
        "Neuroscience",
        "Nuclear Physics",
        "Numerical Analysis",
        "Nutrition and Health",
        "Oceanography",
        "Operations Management",
        "Organic Chemistry",
        "Particle Physics",
        "Personality Psychology",
        "Philosophy of Mind",
        "Photography",
        "Physical Chemistry",
        "Physical Education",
        "Physics of Sound",
        "Planetary Science",
        "Political Philosophy",
        "Portfolio Management",
        "Probability Theory",
        "Professional Writing",
        "Project Management",
        "Psycholinguistics",
        "Public Health",
        "Quantum Mechanics",
        "Real Analysis",
        "Renewable Energy",
        "Robotics",
        "Russian Literature",
        "Sociolinguistics",
        "Software Engineering",
        "Spanish Language",
        "Sports Psychology",
        "Stress Management",
        "Structural Engineering",
        "Supply Chain Management",
        "Surveying",
        "Symbolic Logic",
        "Teaching Methods",
        "Theatre Production",
        "Thermodynamics",
        "Urban Planning",
        "Virtual Reality",
        "Visual Arts",
        "World Religions",
       
    ];

    const handleCourseChange = (event) => {
        setSelectedCourses(event.target.value);
    };
    console.log(selectedCourses)
    const handleNextBtn = async () => {
        if(!(selectedCourses.length===0)){
            setCoursesTaken(selectedCourses)
            navigate('/tutor_subjects')
        }
        else if(selectedCourses.length===0){
            alert("Please select course(s)")
        }
        
        
    }
    
    return (
    <div>
        <h2>Pick courses you have taken</h2>
        <div>
        <FormControl>
        <InputLabel >Courses</InputLabel>
            <Select
            multiple
            value={selectedCourses}
            onChange={handleCourseChange}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 , backgroundColor: '#ffffff'}}>
                {selected.map((value) => (
                    <Chip key={value} label={value}  />
                ))}
                </Box>
            )}>

            {availableCourses.map((course) => (
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
    );
}