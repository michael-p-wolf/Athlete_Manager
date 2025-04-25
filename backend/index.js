import express from "express"
import mysql from "mysql2"
import cors from "cors"

const app = express()

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"608720Bcsc#",
    database:"athlete_db"
})

app.use(express.json())
app.use(cors())

app.get("/", (req,res) =>{
    res.json("this is backend")
})

//select all athletes and their coach
//used on the athlete management page

app.get("/athletes", (req,res)=>{
    const query = "SELECT A.athlete_id, A.name, A.email, C.name AS coach FROM Athlete A JOIN Coach C ON A.coach_id = C.coach_id";
    db.query(query, (err,data)=>{
        if(err) return res.json(err)

        return res.json(data)
    })
})

//Select an athlete with a specific athlete_id
//used on the update athlete page

app.get("/athletes/:athlete_id", (req,res)=>{
    const athlete_id = req.params.athlete_id;
    const query = "SELECT A.athlete_id, A.name, A.email, C.name AS coach FROM Athlete A JOIN Coach C ON A.coach_id = C.coach_id WHERE A.athlete_id = ?";
    db.query(query, athlete_id, (err,data)=>{
        if(err) return res.json(err)

        return res.json(data)
    })
})

//add an athlete, used on that page (SP)

app.post("/athletes", (req,res)=>{
    const query = "CALL insert_athlete(?, ?, ?)";
    const values = [req.body.name, req.body.email, req.body.coach_id];

    db.query(query, values, (err,data)=>{
        if(err) return res.json(err)
        
        return res.json("athlete created")
        
    })
})

//insert a new coach
//had to creat ID b/c mySQL wouldn't allow it

app.post("/coaches", (req, res) => {

    const getMaxIdQuery = "SELECT COALESCE(MAX(coach_id), 0) + 1 AS new_id FROM Coach";

    db.query(getMaxIdQuery, (err, result) => {
        if (err) {
            console.error("Error fetching max workout_id:", err);
            return res.status(500).json({ error: "Database error" });
        }

        const newCoachId = result[0].new_id;


        const insertQuery = "call insert_coach(?, ?, ?)";
        const values = [newCoachId, req.body.name, req.body.email];

        db.query(insertQuery, values, (err, data) => { 
            if (err) {
                console.error("Error inserting coach:", err);
                return res.status(500).json({ error: "Database error" });
            }
        });
    });
});

//delete athlete given specific id

app.delete("/athletes/:athlete_id", (req,res)=>{
    const athleteId = req.params.athlete_id;
    const q1 = "DELETE FROM workout WHERE athlete_id = ?"

    db.query(q1, athleteId, (err,data)=>{
        if (err) return res.json(err);
    })

    const q  = "DELETE FROM Athlete WHERE athlete_id = ?"

    db.query(q, athleteId, (err,data)=>{
        if (err) return res.json(err);
        
        return res.json("athlete deleted");
    })
})

//update athlete

app.put("/athletes/:athlete_id", (req,res)=>{
    const athleteId = req.params.athlete_id;
    const q = "UPDATE Athlete SET name = ?, email = ?, coach_id = ? WHERE athlete_id = ?";

    const values=[
        req.body.name,
        req.body.email,
        req.body.coach_id
    ]

    db.query(q, [...values,athleteId], (err,data)=>{
        if (err) return res.json(err);
        return res.json("athlete updated");
    })
})

//get a certain coach, used for update coach

app.get("/coaches/:coach_id", (req, res) => {
    const coachId = req.params.coach_id;
    const query = "SELECT * FROM Coach WHERE coach_id = ?";

    db.query(query, coachId, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

//update coach

app.put("/coaches/:coach_id", (req,res)=>{
    const coachId = req.params.coach_id;
    const q = "UPDATE Coach SET name = ?, email = ? WHERE coach_id = ?";

    const values=[
        req.body.name,
        req.body.email
    ]

    db.query(q, [...values,coachId], (err,data)=>{
        if (err) return res.json(err);
        return res.json("coach updated");
    })
})

//select all coaches, used on the coach management page

app.get("/coaches", (req,res) => {
    const query = "SELECT coach_id, name, email FROM Coach";
    db.query(query, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
})

//delete a coach with id

app.delete("/coaches/:coach_id", (req,res)=>{
    const coachId = req.params.coach_id;
    const q  = "DELETE FROM Coach WHERE coach_id = ?"

    // need to write a trigger so that we don't have problems with nulls
    
    db.query(q, coachId, (err,data)=>{
        if (err) {
            console.error("my backend error")
            return res.status(500).json({error: "internal error"});
            
        } 
        
        return res.json("coach deleted");
    })
})

//select all the workouts for an athlete

app.get("/athletes/workouts/:athlete_id", (req, res) => {
    const athleteId = req.params.athlete_id;
    const query = "SELECT * FROM Workout WHERE athlete_id = ?";

    db.query(query, athleteId, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

//add a new workout, have to do the same thing with id

app.post("/athletes/workouts/:athlete_id", (req, res) => {
    const athleteId = req.params.athlete_id;


    const getMaxIdQuery = "SELECT COALESCE(MAX(workout_id), 0) + 1 AS new_id FROM Workout";

    db.query(getMaxIdQuery, (err, result) => {
        if (err) {
            console.error("Error fetching max workout_id:", err);
            return res.status(500).json({ error: "Database error" });
        }

        const newWorkoutId = result[0].new_id;


        const insertQuery = "CALL insert_workout(?, ?, ?, ?)";
        const values = [newWorkoutId, athleteId, req.body.type, req.body.time];

        db.query(insertQuery, values, (err, data) => {
            if (err) {
                console.error("Error inserting workout:", err);
                return res.status(500).json({ error: "Database error" });
            }
            return res.json({ message: "Workout added", workout_id: newWorkoutId });
        });
    });
});

//delete a workout for an athlete

app.delete("/athletes/workouts/:athlete_id/:workout_id", (req, res) => {
    const { athlete_id, workout_id } = req.params;

    const query = "DELETE FROM Workout WHERE athlete_id = ? AND workout_id = ?";

    
    
    db.query(query, [athlete_id, workout_id], (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
});

//SP for report 1, get each coaches time per workout type

app.get("/report/report_1", (req, res) => {
    const query = "CALL report_1"
    db.query(query, (err,data)=>{
        if(err) return res.json(err)

            return(res.json(data[0]))
    })
});

//get all the workout types, used to populate drop downs

app.get("/workout-types", (req,res) => {
    const query = "SELECT DISTINCT type FROM workout"
    db.query(query, (err,data)=>{
        if (err) return res.json(err)
        
            return res.json(data)
    })
})

//report 2, get workouts for a coach and workout type

app.get("/report/workouts", (req,res)=> {
    const query = "CALL report_2(?,?)"
    
    db.query(query, [req.query.coach, req.query.type], (err,data)=>{
        if(err) {
            //console.log(err)
            return res.json(err)
        }


        const workoutData = data[0];
        
        // You can log the result and send it back to the client
        //console.log(workoutData);

        return(res.json(workoutData))
        
    })
})





app.listen(8080, ()=>{
    console.log("Connected to backend")
})