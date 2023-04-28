import "./index.css";
import { Component } from "react";
import Cookies from "js-cookie";
import NavBar from "../NavBar";
import MedicineReminderItem from "../MedicineReminderItem";

class Reminders extends Component {
  state = { medicineRemindersList: [] };

  componentDidMount() {
    this.getMedicineRemindersList();
  }

  getMedicineRemindersList = async () => {
    const jwtToken = Cookies.get("jwt_token");
    const url = "/reminders";
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
      const formattedData = data.map((eachReminder) => ({
        id: eachReminder.id,
        medicineName: eachReminder.medicine_name,
        medicineType: eachReminder.medicine_type,
        units: eachReminder.units,
        unitsType: eachReminder.units_type,
        intakeTime: eachReminder.intake_time,
        checked: eachReminder.checked,
      }));
      this.setState({ medicineRemindersList: formattedData });
    }
  };

  deleteCheckedMedicineReminders = async () => {
    const jwtToken = Cookies.get("jwt_token");
    const url = "/reminders/medicine";
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

  render() {
    const { medicineRemindersList } = this.state;
    return (
      <div>
        <NavBar />
        <div className="reminders-body">
          <div className="medicines-reminders-container">
            <button
              type="button"
              className="delete-checked-btn"
              onClick={this.deleteCheckedMedicineReminders}
            >
              Delete Checked
            </button>
            <ul className="medicines-reminders-list">
              {medicineRemindersList.map((eachReminder) => (
                <MedicineReminderItem
                  key={eachReminder.id}
                  reminderDetails={eachReminder}
                  getMedicineRemindersList={this.getMedicineRemindersList}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
export default Reminders;
