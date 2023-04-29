import "./index.css";
import NavBar from "../NavBar";
import LoaderItem from "../LoaderItem";
import EmptyView from "../EmptyView";
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
    await this.getGlucoseLevelList();
  };

  renderTrackersSwitch = () => {
    const { trackersApiStatus } = this.state;
    switch (trackersApiStatus) {
      case apiStatusOptions.isLoading:
        return <LoaderItem />;
      case apiStatusOptions.success:
        return this.renderGlucoseTracker();
      case apiStatusOptions.failure:
        return <p>Something Went Wrong</p>;
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
      console.log(`b ${before} b ${after}`);
      const suggestionOptions = {
        0: {
          text: "Your glucose level are normal. Be healthy always.",
          className: "green-text",
        },
        1: {
          text: "Your glucose level are moderate. Keep taking healthy measures.",
          className: "orange-text",
        },
        2: {
          text: "Your glucose level are high. Take medications after consulting your doctor.",
          className: "red-text",
        },
      };
      let beforeCode = 0;
      if (80 <= before && before <= 100) {
        beforeCode = 0;
      } else if (101 <= before && before <= 125) {
        beforeCode = 1;
      } else if (126 <= before) {
        beforeCode = 2;
      }
      let afterCode = 0;
      if (170 <= after && after <= 200) {
        afterCode = 0;
      } else if (190 <= after && after <= 230) {
        afterCode = 1;
      } else if (220 <= after) {
        afterCode = 2;
      }
      console.log(beforeCode);
      console.log(suggestionOptions[beforeCode]);
      if (beforeCode > afterCode) {
        return (
          <p className={suggestionOptions[beforeCode].className}>
            {suggestionOptions[beforeCode].text}
          </p>
        );
      } else {
        return (
          <p className={suggestionOptions[afterCode].className}>
            {suggestionOptions[afterCode].text}
          </p>
        );
      }
    };
    const showToggleText = viewAllGlucoseLevels ? "Hide All" : "Show All";
    return (
      <>
        <h1 className="tracker-heading">Glucose Tracker History</h1>
        {glucoseLevelList.length > 0 ? (
          <>
            <div className="chart-container">
              <LineChart
                width={600}
                height={300}
                data={data.reverse()}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                className="chart"
              >
                <Line
                  type="monotone"
                  dataKey="levelBeforeMeal"
                  stroke="#8884d8"
                />
                <Line
                  type="monotone"
                  dataKey="levelAfterMeal"
                  stroke="#fc7830"
                />
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
              <>
                <ul className="glucose-level-list">
                  {glucoseLevelList.map((eachLevel) => (
                    <GlucoseLevelItem
                      key={eachLevel.id}
                      glucoseLevelDetails={eachLevel}
                      getGlucoseLevelList={this.getGlucoseLevelList}
                    />
                  ))}
                </ul>
                <button
                  type="button"
                  className="delete-checked-btn"
                  onClick={this.deleteCheckedGlucoseLevels}
                >
                  Delete Checked
                </button>
              </>
            ) : null}
          </>
        ) : (
          <EmptyView
            msg={"No records available. Add glucose levels to track them here."}
          />
        )}
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
