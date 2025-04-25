import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/Home";
import AthleteManagement from "./pages/AthleteManagement";
import CoachManagement from "./pages/CoachManagement"; 
import Report from "./pages/Report";
import Update from "./pages/Update";
import Add from "./pages/Add"
import "./style.css";
import Workouts from "./pages/Workouts";
import UpdateCoach from "./pages/UpdateCoach";
import AddCoach from "./pages/AddCoach";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/athletes" element={<AthleteManagement />} />
          <Route path="/athletes/add" element={<Add />} />
          <Route path="/athletes/update/:athlete_id" element={<Update />} />
          <Route path="/athletes/workouts/:athlete_id" element={<Workouts />} />

          
          <Route path="/coaches" element={<CoachManagement />} />
          <Route path ="/coaches/update/:coach_id" element={<UpdateCoach />} />
          <Route path="/coaches/add" element={<AddCoach />} />
          
          <Route path="/report" element={<Report />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
