import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const AddCoach = () => {
    const navigate = useNavigate();
    const [coach, setCoach] = useState({ name: "", email: "" });

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/coaches", coach);
            
        } catch (error) {
            console.error("Error adding coach:", error);
            alert(error.response?.data?.error || "Failed to add coach.");
        }
    };

    const handleChange = (e) => {
        setCoach(prev=>({...prev, [e.target.name]:e.target.value }))
    }

    console.log(coach)

    return (
        <div>
            <h1>Add New Coach</h1>
            <form>
                <label>
                    Name:
                    <input 
                        type="text" 
                        placeholder="Name"
                        onChange={handleChange} 
                        name="name"
                    />
                </label>
                <br />
                <label>
                    Email:
                    <input 
                        type="email" 
                        placeholder="Email"
                        onChange={handleChange} 
                        name="email"
                    />
                </label>
                <br />
                <button onClick={handleSubmit}><Link to =".." relative = "path">Add Coach</Link></button>

                <button type="button" onClick={() => navigate("/coaches")}>Cancel</button>
            </form>
        </div>
    );
};

export default AddCoach;
