import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to the Athlete Management App</h1>
      <div className="button-container">
        <Link to="/athletes">
          <button className="nav-button">Go to Athlete Management</button>
        </Link>
        <Link to="/coaches">
          <button className="nav-button">Go to Coach Management</button>
        </Link>
        <Link to="/report">
          <button className="nav-button">Go to Report</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;