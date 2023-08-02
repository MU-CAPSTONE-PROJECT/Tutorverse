import { useState } from 'react';
import './TutorSchedule.css'
import { useNavigate } from 'react-router-dom';

export default function TutorSchedule ({setSchedule, schedule}) {
  
    const navigate = useNavigate();

    const handleAddSlot = (day) => {
        const newSlot = { startTime: '', endTime: '' };
        setSchedule((prevSchedule) => ({
        ...prevSchedule,
        [day]: [...prevSchedule[day], newSlot],
        }));
    };

    const handleTimeChange = (day, index, field, value) => {
        setSchedule((prevSchedule) => {
        const newSchedule = { ...prevSchedule };
        newSchedule[day][index][field] = value;
        return newSchedule;
        });
    };

    const handleSaveSchedule = () => {
    
        console.log('Saving schedule:', schedule);
        navigate('/register')
    };

    return (
        <div>
        <h2>Create your schedule</h2>
        {Object.keys(schedule).map((day) => (
            <div key={day}>
            <h3>{day}</h3>
            {schedule[day].map((slot, index) => (
                <div key={index}>
                <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) =>
                    handleTimeChange(day, index, 'startTime', e.target.value)
                    }
                />
                <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) =>
                    handleTimeChange(day, index, 'endTime', e.target.value)
                    }
                />
                </div>
            ))}
            <button onClick={() => handleAddSlot(day)}>Add Slot</button>
            </div>
        ))}
        <button onClick={handleSaveSchedule}>Save Schedule</button>
        </div>
    );
}

