import NavBar from "../NavBar";
import MedicineUnitButtonItem from "../MedicineUnitButtonItem";
import "./index.css";
import { Component } from "react";
import Cookies from "js-cookie";

const medicineUnitButtonList = [
  {
    id: "MG",
    value: "MG",
  },
  {
    id: "ML",
    value: "ML",
  },
  {
    id: "U",
    value: "U",
  },
];

class MedicineReminderForm extends Component {
  state = {
    medicineName: "",
    medicineType: "Tablet",
    units: 0,
    unitsType: "MG",
    intakeTime: "",
    intakeTimeList: [],
    startFrom: "",
    repeatDays: 0,
  };

  onMedicineNameChange = (event) => {
    this.setState({ medicineName: event.target.value });
  };

  onMedicineTypeChange = (event) => {
    this.setState({ medicineType: event.target.value });
  };

  onUnitsChange = (event) => {
    this.setState({ units: event.target.value });
  };

  onUnitsTypeChange = (id) => {
    this.setState({ unitsType: id });
  };

  onIntakeTimeChange = (event) => {
    this.setState({ intakeTime: event.target.value });
  };

  onSaveTime = () => {
    const { intakeTime } = this.state;
    this.setState((prevState) => ({
      intakeTimeList: [...prevState.intakeTimeList, intakeTime],
    }));
  };

  onAddNewTime = () => {
    this.setState({ intakeTime: "" });
  };

  onStartFromChange = (event) => {
    this.setState({ startFrom: event.target.value });
  };

  onRepeatDaysChange = (event) => {
    this.setState({ repeatDays: event.target.value });
  };

  onAddReminderClick = async (event) => {
    event.preventDefault();
    const {
      medicineName,
      medicineType,
      units,
      unitsType,
      intakeTimeList,
      startFrom,
      repeatDays,
    } = this.state;
    const data = {
      medicineName,
      medicineType,
      units,
      unitsType,
      intakeTimeList,
      startFrom,
      repeatDays,
      checked: 0,
    };

    const jwtToken = Cookies.get("jwt_token");

    const url = "/add-medicine-reminder";
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
      alert("New Medicine Reminder Added");
      const { history } = this.props;
      history.push("/reminders");
    } else {
      alert("Something went Wrong");
    }
  };
  render() {
    const {
      medicineName,
      medicineType,
      units,
      unitsType,
      intakeTime,
      startFrom,
      repeatDays,
    } = this.state;
    return (
      <div className="medicine-form-bg-container">
        <NavBar />
        <div className="medicine-form-container">
          <form className="medicine-form" onSubmit={this.onAddReminderClick}>
            <h1 className="medicine-form-heading">New Medicine Reminder</h1>
            <label htmlFor="medicine-name" className="medicine-form-label">
              MEDICINE NAME
            </label>
            <input
              id="medicine-name"
              type="text"
              className="medicine-form-input"
              placeholder="MEDICINE NAME"
              value={medicineName}
              onChange={this.onMedicineNameChange}
            />
            <label htmlFor="medicine-type" className="medicine-form-label">
              MEDICINE TYPE
            </label>
            <select
              id="medicine-type"
              className="medicine-form-input"
              placeholder="MEDICINE TYPE"
              value={medicineType}
              onChange={this.onMedicineTypeChange}
            >
              <option id="TABLET" value="Tablet">
                Tablet
              </option>
              <option id="SYRINGE" value="Syringe">
                Syringe
              </option>
              <option id="PILL" value="Pill">
                Pill
              </option>
              <option id="SYRUP" value="Syrup">
                Syrup
              </option>
            </select>
            <div className="units-input-container">
              <div className="units-input">
                <label htmlFor="units" className="medicine-form-label">
                  UNITS
                </label>
                <input
                  id="units"
                  type="number"
                  className="medicine-form-input"
                  style={{ width: "80px" }}
                  value={units}
                  onChange={this.onUnitsChange}
                />
              </div>
              <ul className="unit-btn-container">
                {medicineUnitButtonList.map((eachBtn) => (
                  <MedicineUnitButtonItem
                    key={eachBtn.id}
                    buttonDetails={eachBtn}
                    onUnitsTypeChange={this.onUnitsTypeChange}
                    isActive={eachBtn.id === unitsType}
                  />
                ))}
              </ul>
            </div>
            <label htmlFor="add-intake-time" className="medicine-form-label">
              ADD INTAKE TIME
            </label>
            <input
              id="add-intake-time"
              type="time"
              className="medicine-form-input"
              value={intakeTime}
              onChange={this.onIntakeTimeChange}
            />
            <div>
              <button
                type="button"
                className="medicine-add-button"
                onClick={this.onSaveTime}
              >
                Save Time
              </button>
              <button
                type="button"
                className="medicine-add-button"
                onClick={this.onAddNewTime}
              >
                + Add New Time
              </button>
            </div>
            <label htmlFor="start-from" className="medicine-form-label">
              START FROM
            </label>
            <input
              id="start-from"
              type="date"
              className="medicine-form-input"
              value={startFrom}
              onChange={this.onStartFromChange}
            />
            <label htmlFor="repeat" className="medicine-form-label">
              REPEAT EVERYDAY FOR X DAYS
            </label>
            <input
              id="repeat"
              type="number"
              className="medicine-form-input"
              value={repeatDays}
              onChange={this.onRepeatDaysChange}
            />
            <button type="submit" className="add-medicine-remainder-button">
              Add Reminder
            </button>
          </form>
        </div>
      </div>
    );
  }
}
export default MedicineReminderForm;
