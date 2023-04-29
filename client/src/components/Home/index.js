import "./index.css";
import { GiMedicines } from "react-icons/gi";
import { BsFillDropletFill } from "react-icons/bs";
import { AiOutlineSchedule } from "react-icons/ai";
import { Link } from "react-router-dom";
import NavBar from "../NavBar";

const Home = () => (
  <div>
    <NavBar />
    <div className="home-image" />
    <div className="home-body">
      <Link to="/add-medicine-reminder" className="home-links">
        <div className="add-medicine-reminder-container">
          <div className="add-medicine-icon-container">
            <GiMedicines size={25} />
          </div>
          <p className="add-medicine-reminder-title">New Medicine Reminder</p>
          <button type="button" className="add-medicine-reminder-button">
            +Add
          </button>
        </div>
      </Link>
      <Link to="/add-glucose-level" className="home-links">
        <div className="add-glucose-level-container">
          <div className="add-glucose-icon-container">
            <BsFillDropletFill size={25} />
          </div>
          <p className="add-glucose-level-title">New Glucose Level</p>
          <button type="button" className="add-glucose-level-button">
            +Add
          </button>
        </div>
      </Link>
      <div className="add-appointment-reminder-container">
        <div className="add-appointment-icon-container">
          <AiOutlineSchedule size={25} />
        </div>
        <p className="add-appointment-title">New Appointment</p>
        <button type="button" className="add-appointment-button">
          Coming Soon
        </button>
      </div>
    </div>
  </div>
);

export default Home;
