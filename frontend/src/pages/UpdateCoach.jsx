import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateCoach = () => {
    const [coach, setCoach] = useState({
        name: "",
        email: "",
    });

    const navigate = useNavigate();
    const location = useLocation();
    const coach_id = location.pathname.split("/")[3];

    // Fetch athlete details and coaches on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch athlete details
                const coachRes = await axios.get(`http://localhost:8080/coaches/`+coach_id);
                

                const fetchedCoach = Array.isArray(coachRes.data) ? coachRes.data[0] : coachRes.data;

                setCoach({
                    name: fetchedCoach.name || "",
                    email: fetchedCoach.email || ""
                });

            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [coach_id]);

    const handleChange = (e) => {
        setCoach(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/coaches/`+coach_id, coach);
            console.log("Update successful");
            navigate(-1); // Go back to the previous page
        } catch (err) {
            console.log(err);
        }
    };

    

    return (
        <div className="form">
            <h1>Update Coach</h1>
            <input 
                type="text" 
                placeholder={coach.name ? coach.name : "Enter name"} 
                onChange={handleChange} 
                name="name"
            />
            <input 
                type="email" 
                placeholder={coach.email ? coach.email : "Enter email"} 
                onChange={handleChange} 
                name="email"
            />
            <button onClick={handleClick}>Update</button>
            <button onClick={() => navigate(-1)}>Cancel</button>
        </div>
    );
};

export default UpdateCoach;