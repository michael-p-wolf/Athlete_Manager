import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

const Athletes = () => {
const[atheltes, setAthletes] = useState([])

useEffect(() => {
    const fetchAllAthletes = async () => {
        try {
            const res = await axios.get("http://localhost:8080/athletes")
        
            setAthletes(res.data);
        } catch(err) {
            console.log(err)
        }
    }
    fetchAllAthletes()
},[]);

    const handleDelete = async (athlete_id)=>{
        try {
            await axios.delete("http://localhost:8080/athletes/"+athlete_id)
            window.location.reload()
        } catch (err){
            console.log(err)
        }
    }

    return ( <div>
        <h1>Athletes</h1>
        <div className="Athletes">
            {atheltes.map(athlete=>(
                <div className="athlete" key={athlete.athlete_id}>
                    <h2>{athlete.name}</h2>
                    <button className="delete" onClick={()=>handleDelete(athlete.athlete_id)}>Delete</button>
                    <button className="update"><Link to={"/update/"+athlete.athlete_id}>Update</Link></button>
                </div>
            ))}
        </div>
        <button>
            <Link to="/add">Add New Athlete</Link>
        </button>
     </div>
    )
}

export default Athletes