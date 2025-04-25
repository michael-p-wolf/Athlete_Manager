import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Workouts = () => {
    const [workouts, setWorkouts] = useState([]);
    const [newWorkout, setNewWorkout] = useState({ type: "Swim", time: "" });
    const navigate = useNavigate();
    const location = useLocation();
    const athlete_id = location.pathname.split("/")[3];
    const [athleteName, setAthleteName] = useState("");

    useEffect(() => {

        const fetchAthlete = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/athletes/${athlete_id}`);
                setAthleteName(res.data[0].name)
                console.log(res.data[0].name)
                

            } catch (err) {
                console.log(err);
            }
        };

        const fetchWorkouts = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/athletes/workouts/${athlete_id}`);
                setWorkouts(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAthlete();
        fetchWorkouts();
    }, [athlete_id]);

    const handleDelete = async (workout_id) => {
        try {
            await axios.delete(`http://localhost:8080/athletes/workouts/${athlete_id}/${workout_id}`);
            //setWorkouts(workouts.filter(workout => workout.workout_id !== workout_id));
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    const handleAddWorkout = async () => {

        try {
            const res = await axios.post(`http://localhost:8080/athletes/workouts/${athlete_id}`, newWorkout);
            setWorkouts([...workouts, res.data]);
            setNewWorkout({ type: "", time: "" });
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <h1>Workouts for {athleteName}</h1>
            <button onClick={() => navigate(-1)}>Back</button>
            <ul>
                {workouts.map(workout => (
                    <li key={workout.workout_id}>
                        {workout.type} - {workout.time} minutes
                        <button onClick={() => handleDelete(workout.workout_id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <div>
                <h2>Add Workout</h2>
                <select 
                    name="type"
                    value={newWorkout.type} 
                    onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })}
                >
                    <option value="Swim">Swim</option>
                    <option value="Bike">Bike</option>
                    <option value="Run">Run</option>
                </select>

                <input 
                    type="number" 
                    placeholder="Time (minutes)" 
                    value={newWorkout.time} 
                    onChange={(e) => setNewWorkout({ ...newWorkout, time: e.target.value })}
                />
                <button onClick={handleAddWorkout}>Add Workout</button>
            </div>
        </div>
    );
};

export default Workouts;
