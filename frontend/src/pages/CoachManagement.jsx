import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

const CoachManagement = () => {
const[coaches, setCoaches] = useState([])

useEffect(() => {
    const fetchAllCoahces = async() => {
        try {
            const res = await axios.get("http://localhost:8080/coaches")
            setCoaches(res.data);
        } catch (err) {
            console.log(err);
        }
    }
    fetchAllCoahces()

}, []);

const handleDelete = async (coach_id) => {
    try {
        await axios.delete("http://localhost:8080/coaches/"+coach_id);
        window.location.reload()
    } catch (err) {
        //window.alert("Can't delete coach because they currently have athletes");
        window.alert("Can't delete coach because they currently have active athletes")
        console.log(err);
    }
}

return (
    <div>
        <h1>Coaches</h1>
        <button>
            <Link to="/coaches/add">Add New Coach</Link>
        </button>
        <div className="CoachManagement">
            {coaches.map(coach => (
                <div className="coach" key={coach.coach_id}>
                    <h2>{coach.name}</h2>
                    <p>Email: {coach.email}</p>
                    <button className="delete" onClick={() => handleDelete(coach.coach_id)}>Delete</button>
                    <button className="update">
                        <Link to={`/coaches/update/${coach.coach_id}`}>Update</Link>
                    </button>
                </div>
            ))}
        </div>
        <button>
            <Link to=".." relative="path">Home</Link>
        </button>
    </div>
);

}

export default CoachManagement