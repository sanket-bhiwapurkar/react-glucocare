import "./index.css";
import NavBar from "../NavBar";
import LoaderItem from "../LoaderItem";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import GlucoseLevelItem from "../GlucoseLevelItem";
import { Component } from "react";
import Cookies from "js-cookie";

const apiStatusOptions = {
  initial: "INITIAL",
  isLoading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
};

class Trackers extends Component {
  state = {
    trackersApiStatus: apiStatusOptions.initial,
    glucoseLevelList: [],
    viewAllGlucoseLevels: false,
  };

  componentDidMount() {
    this.getGlucoseLevelList();
  }

  getGlucoseLevelList = async () => {
    this.setState({ trackersApiStatus: apiStatusOptions.isLoading });
    const jwtToken = Cookies.get("jwt_token");
    const url = "/trackers/glucose";
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    const response = await fetch(url, options);
    if (response.ok === true) {
      const data = await response.json();
      console.log(data);
      const formattedData = data.map((eachLevel) => ({
        id: eachLevel.id,
        levelBeforeMeal: eachLevel.level_before_meal,
        levelAfterMeal: eachLevel.level_after_meal,
        date: eachLevel.checkup_date,
        checked: eachLevel.checked,
      }));
      this.setState({
        glucoseLevelList: formattedData,
        trackersApiStatus: apiStatusOptions.success,
      });
    } else {
      this.setState({ trackersApiStatus: apiStatusOptions.failure });
    }
  };

  onToggleGlucoseLevels = () => {
    this.setState((prevState) => ({
      viewAllGlucoseLevels: !prevState.viewAllGlucoseLevels,
    }));
  };

  deleteCheckedGlucoseLevels = async () => {
    const jwtToken = Cookies.get("jwt_token");
    const url = "/trackers/glucose";
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    await fetch(url, options);
    this.getMedicineRemindersList();
  };

  renderTrackersSwitch = () => {
    const { trackersApiStatus } = this.state;
    switch (trackersApiStatus) {
      case apiStatusOptions.isLoading:
        return <LoaderItem />;
      case apiStatusOptions.success:
        return this.renderGlucoseTracker();
      case apiStatusOptions.failure:
        return <h1>Something Went Wrong</h1>;
      default:
        return null;
    }
  };

  renderGlucoseTracker = () => {
    const { glucoseLevelList, viewAllGlucoseLevels } = this.state;
    const data = glucoseLevelList.slice(0, 5);

    const suggestion = () => {
      const before = glucoseLevelList[0].levelBeforeMeal;
      const after = glucoseLevelList[0].levelAfterMeal;
      if (80 <= before <= 100 || 170 <= after <= 200) {
        return (
          <p className="green-text">
            Your glucose level are normal. Be healthy always.
          </p>
        );
      } else if (101 <= before <= 125 || 190 <= after <= 230) {
        return (
          <p className="yellow-text">
            Your glucose level are moderate. Keep taking healthy measures.
          </p>
        );
      } else if (126 <= before || 220 <= after) {
        return (
          <p className="orange-text">
            Your glucose level are high. Take medications after consulting your
            doctor.
          </p>
        );
      } else {
        return (
          <p className="red-text">
            Your glucose level are dangerous. You urgently need medical
            attention.
          </p>
        );
      }
    };
    const showToggleText = viewAllGlucoseLevels ? "Hide All" : "Show All";
    return (
      <>
        <h1 className="tracker-heading">Glucose Tracker History</h1>
        <div className="chart-container">
          <LineChart
            width={600}
            height={300}
            data={data.reverse()}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            className="chart"
          >
            <Line type="monotone" dataKey="levelBeforeMeal" stroke="#8884d8" />
            <Line type="monotone" dataKey="levelAfterMeal" stroke="#fc7830" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" className="chart-font" />
            <YAxis className="chart-font" />
            <Tooltip />
          </LineChart>
        </div>
        <p className="before-meal-ref">
          -Before Meal
          <span className="after-meal-ref">&emsp; -After Meal</span>
        </p>
        {suggestion()}
        <hr className="ruler" />
        <button
          type="button"
          className="tracker-show-toggle-btn"
          onClick={this.onToggleGlucoseLevels}
        >
          {showToggleText}
        </button>
        {viewAllGlucoseLevels ? (
          <ul className="glucose-level-list">
            {glucoseLevelList.map((eachLevel) => (
              <GlucoseLevelItem
                key={eachLevel.id}
                glucoseLevelDetails={eachLevel}
              />
            ))}
          </ul>
        ) : null}
      </>
    );
  };

  render() {
    return (
      <div>
        <NavBar />
        <div className="trackers-body">
          <div className="glucose-level-tracker">
            {this.renderTrackersSwitch()}
          </div>
        </div>
      </div>
    );
  }
}
export default Trackers;
