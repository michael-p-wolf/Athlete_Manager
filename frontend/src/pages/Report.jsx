import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Report.css";

const Reports = () => {
    const [workoutSummary, setWorkoutSummary] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedCoach, setSelectedCoach] = useState("");
    const [selectedType, setSelectedType] = useState("");

    // Fetch initial data
    useEffect(() => {
        fetchWorkoutSummary();
        fetchCoaches();
        fetchWorkoutTypes();
    }, []);

    // Fetch total time per workout per coach
    const fetchWorkoutSummary = async () => {
        try {
            const response = await axios.get("http://localhost:8080/report/report_1");
            setWorkoutSummary([...response.data]);
        } catch (error) {
            console.error("Error fetching workout summary:", error);
        }
    };

    // Fetch all coaches for filtering
    const fetchCoaches = async () => {
        try {
            const response = await axios.get("http://localhost:8080/coaches");
            setCoaches(response.data);
        } catch (error) {
            console.error("Error fetching coaches:", error);
        }
    };

    // Fetch unique workout types for filtering
    const fetchWorkoutTypes = async () => {
        try {
            const response = await axios.get("http://localhost:8080/workout-types");
            setTypes(response.data);
        } catch (error) {
            console.error("Error fetching workout types:", error);
        }
    };

    // Fetch workouts with filters
    const fetchWorkouts = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8080/report/workouts", {
                params: { coach: selectedCoach, type: selectedType }
            });
            setWorkouts(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Error fetching workouts:", error);
            setWorkouts([]); // Prevents undefined issues
        }
    }, [selectedCoach, selectedType]);

    // Handle filter changes
    const handleFilterChange = () => {
        fetchWorkouts();
    };

    return (
        <div>
            <h1>Reports</h1>

            {/* Total Time Per Coach */}
            <h2>Total Workout Time Per Coach</h2>
            <table className="workout-summary-table">
                <thead>
                    <tr>
                        <th>Coach</th>
                        <th>Workout Type</th>
                        <th>Total Time</th>
                    </tr>
                </thead>
                <tbody>
                    {workoutSummary.length > 0 ? (
                        workoutSummary.map((item, index) => (
                            <tr key={index}>
                                <td>{item.coach_name}</td>
                                <td>{item.workout_type}</td>
                                <td>{item.total_time}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Filters for Workouts */}
            <h2>Workouts</h2>
            <div>
                <label>Filter by Coach: </label>
                <select value={selectedCoach} onChange={(e) => setSelectedCoach(e.target.value)}>
                    <option value="">All Coaches</option>
                    {coaches.map((coach) => (
                        <option key={coach.coach_id} value={coach.name}>{coach.name}</option>
                    ))}
                </select>

                <label> Filter by Type: </label>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                    <option value="">All Types</option>
                    {types.map(type => (
                        <option key={type.type} value={type.type}>{type.type}</option>
                    ))}
                </select>

                {/* Apply filters only when button is clicked */}
                <button onClick={handleFilterChange}>Apply Filters</button>
            </div>

            {/* Workouts List */}
            <table className="workout-summary-table">
                <thead>
                    <tr>
                        <th>Athlete</th>
                        <th>Workout</th>
                        <th>Time</th>
                        <th>Coach</th>
                    </tr>
                </thead>
                <tbody>
                    {workouts.map((workout,index) => (
                        <tr key={index}>
                            <td>{workout.athlete_name}</td>
                            <td>{workout.workout_type}</td>
                            <td>{workout.workout_time}</td>
                            <td>{workout.coach_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Reports;
