import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Update = () => {
    const [athlete, setAthlete] = useState({
        name: "",
        email: "",
        coach_id: ""
    });

    const [coaches, setCoaches] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const athlete_id = location.pathname.split("/")[3];

    // Fetch athlete details and coaches on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch athlete details
                const athleteRes = await axios.get(`http://localhost:8080/athletes/`+athlete_id);
                

                const fetchedAthlete = Array.isArray(athleteRes.data) ? athleteRes.data[0] : athleteRes.data;

                const coachRes = await axios.get("http://localhost:8080/coaches");

                setCoaches(coachRes.data);  // Set coaches first

                // Ensure coach_id exists in coaches list
                const coachExists = coachRes.data.some(coach => coach.coach_id === fetchedAthlete.coach_id);
                const initialCoachId = coachExists ? fetchedAthlete.coach_id : "";

                setAthlete({
                    name: fetchedAthlete.name || "",
                    email: fetchedAthlete.email || "",
                    coach_id: initialCoachId
                });

            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [athlete_id]);

    const handleChange = (e) => {
        setAthlete(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/athletes/`+athlete_id, athlete);
            console.log("Update successful");
            navigate(-1); // Go back to the previous page
        } catch (err) {
            console.log(err);
        }
    };

    

    return (
        <div className="form">
            <h1>Update Athlete</h1>
            <input 
                type="text" 
                placeholder={athlete.name ? athlete.name : "Enter name"} 
                onChange={handleChange} 
                name="name"
            />
            <input 
                type="email" 
                placeholder={athlete.email ? athlete.email : "Enter email"} 
                onChange={handleChange} 
                name="email"
            />
            <select name="coach_id" value={athlete.coach_id} onChange={handleChange}>
            
                {coaches.map(coach => (
                    <option key={coach.coach_id} value={coach.coach_id}>
                        {coach.coach_id} - {coach.name}
                    </option>
                ))}
            </select>
            <button onClick={handleClick}>Update</button>
            <button onClick={() => navigate(-1)}>Cancel</button>
        </div>
    );
};

export default Update;