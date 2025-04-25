import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Add = () => {
    const [athlete, setAthlete] = useState({
        name:"",
        email: "",
        coach_id: ""
    });

    const [coaches, setCoaches] = useState([]);

    useEffect(() => {

        const fetchCoaches = async () => {
            try {
                const res = await axios.get("http://localhost:8080/coaches");
                setCoaches(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchCoaches();
    }, []);

    const handleChange = (e) => {
        setAthlete(prev=>({...prev, [e.target.name]:e.target.value }))
    }

    const handleClick = async e =>{
        e.preventDefault()
        try {
            await axios.post("http://localhost:8080/athletes", athlete)
        } catch (err) {
            console.log(err);
        }
    }

    console.log(athlete)

    return (
        <div className='form'>
            <h1>Add New Athlete</h1>
            <input 
        type="text" 
        placeholder="Name" 
        onChange={handleChange} 
        name="name"
    />
    <input 
        type="email" 
        placeholder="Email" 
        onChange={handleChange} 
        name="email"
    />
    <select name="coach_id" onChange={handleChange}>
        <option value="">Select Coach</option>
        {coaches.map(coach => (
            <option key={coach.coach_id} value={coach.coach_id}>
                {coach.coach_id} - {coach.name}
            </option>
        ))}
    </select>
    <button onClick={handleClick}><Link to =".." relative = "path">Add</Link></button>

        </div>   
    )
}

export default Add