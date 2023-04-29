import NavBar from "../NavBar";
import "./index.css";
import { Component } from "react";
import Cookies from "js-cookie";

class GlucoseLevelForm extends Component {
  state = {
    levelBeforeMeal: 0,
    levelAfterMeal: 0,
    checkupDate: "",
  };

  onLevelBeforeMealChange = (event) => {
    this.setState({ levelBeforeMeal: event.target.value });
  };

  onLevelAfterMealChange = (event) => {
    this.setState({ levelAfterMeal: event.target.value });
  };

  onDateOfCheckupChange = (event) => {
    this.setState({ checkupDate: event.target.value });
  };

  onAddGlucoseLevelClick = async (event) => {
    event.preventDefault();
    const { levelBeforeMeal, levelAfterMeal, checkupDate } = this.state;
    const data = {
      levelBeforeMeal,
      levelAfterMeal,
      checkupDate,
      checked: 0,
    };

    const jwtToken = Cookies.get("jwt_token");

    const url = "/add-glucose-level";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, options);
    if (response.ok === true) {
      alert("New Glucose Level Added");
      const { history } = this.props;
      history.replace("/trackers");
    } else {
      alert("Something went Wrong");
    }
  };
  render() {
    const { levelBeforeMeal, levelAfterMeal, checkupDate } = this.state;
    return (
      <div className="glucose-form-bg-container">
        <NavBar />
        <div className="glucose-form-container">
          <form className="glucose-form" onSubmit={this.onAddGlucoseLevelClick}>
            <h1 className="glucose-form-heading">New Glucose Level</h1>
            <label htmlFor="level-before-meal" className="glucose-form-label">
              LEVEL BEFORE MEAL MG/DL
            </label>
            <input
              id="level-before-meal"
              type="number"
              className="glucose-form-input"
              value={levelBeforeMeal}
              onChange={this.onLevelBeforeMealChange}
            />
            <label htmlFor="level-after-meal" className="glucose-form-label">
              LEVEL AFTER MEAL MG/DL
            </label>
            <input
              id="level-after-meal"
              type="number"
              className="glucose-form-input"
              value={levelAfterMeal}
              onChange={this.onLevelAfterMealChange}
            />

            <div className="units-input-container"></div>
            <label htmlFor="date-of-checkup" className="glucose-form-label">
              DATE OF CHECKUP
            </label>
            <input
              id="date-of-checkup"
              type="date"
              className="glucose-form-input"
              value={checkupDate}
              onChange={this.onDateOfCheckupChange}
            />

            <button type="submit" className="add-glucose-button">
              Add Glucose Level
            </button>
          </form>
        </div>
      </div>
    );
  }
}
export default GlucoseLevelForm;
