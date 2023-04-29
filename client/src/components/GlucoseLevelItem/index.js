import Cookies from "js-cookie";
import "./index.css";
import { Component } from "react";
import { BsCalendar3 } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";

class GlucoseLevelItem extends Component {
  state = { isChecked: false };

  componentDidMount() {
    const { glucoseLevelDetails } = this.props;
    const { checked } = glucoseLevelDetails;
    this.setState({ isChecked: checked });
  }

  onCheckboxChange = async (event, id) => {
    this.setState((prevState) => ({ isChecked: !prevState.isChecked }));
    const jwtToken = Cookies.get("jwt_token");
    const url = `/trackers/glucose/${id}`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ checked: event.target.checked }),
    };
    await fetch(url, options);
  };

  deleteGlucoseLevel = async (id, getGlucoseLevelList) => {
    const jwtToken = Cookies.get("jwt_token");
    const url = `/trackers/glucose/${id}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    await fetch(url, options);
    await getGlucoseLevelList();
  };

  render() {
    const { isChecked } = this.state;
    const { glucoseLevelDetails, getGlucoseLevelList } = this.props;
    const { id, levelBeforeMeal, levelAfterMeal, date } = glucoseLevelDetails;
    return (
      <li className="glucose-level-ltem">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(event) => this.onCheckboxChange(event, id)}
        />
        <div className="glucose-level-text-container">
          <div className="glucose-level-text-items spacing">
            <h1 className="glucose-level-text-heading">{date}</h1>
            <BsCalendar3 size={14} />
          </div>
          <div className="glucose-level-text-items">
            <p className="glucose-level-text">Fasting:</p>
            <p className="glucose-level-text">{levelBeforeMeal}</p>
          </div>
          <div className="glucose-level-text-items">
            <p className="glucose-level-text">After Meal:</p>
            <p className="glucose-level-text">{levelAfterMeal}</p>
          </div>
        </div>
        <button
          type="button"
          className="glucose-level-delete-btn"
          onClick={() => this.deleteGlucoseLevel(id, getGlucoseLevelList)}
        >
          <RiDeleteBin6Line size={20} />
        </button>
      </li>
    );
  }
}
export default GlucoseLevelItem;
