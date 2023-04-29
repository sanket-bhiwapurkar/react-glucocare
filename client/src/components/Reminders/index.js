import "./index.css";
import { Component } from "react";
import Cookies from "js-cookie";
import NavBar from "../NavBar";
import LoaderItem from "../LoaderItem";
import MedicineReminderItem from "../MedicineReminderItem";
import EmptyView from "../EmptyView";

const apiStatusOptions = {
  initial: "INITIAL",
  isLoading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
};

class Reminders extends Component {
  state = {
    remindersApiStatus: apiStatusOptions.initial,
    medicineRemindersList: [],
  };

  componentDidMount() {
    this.getMedicineRemindersList();
  }

  getMedicineRemindersList = async () => {
    this.setState({ remindersApiStatus: apiStatusOptions.isLoading });
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
      this.setState({
        remindersApiStatus: apiStatusOptions.success,
        medicineRemindersList: formattedData,
      });
    } else {
      this.setState({ remindersApiStatus: apiStatusOptions.failure });
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

  renderRemindersSwitch = () => {
    const { remindersApiStatus } = this.state;
    switch (remindersApiStatus) {
      case apiStatusOptions.isLoading:
        return <LoaderItem />;
      case apiStatusOptions.success:
        return this.renderMedicineReminders();
      case apiStatusOptions.failure:
        return <p>Something Went Wrong</p>;
      default:
        return null;
    }
  };

  renderMedicineReminders = () => {
    const { medicineRemindersList } = this.state;
    return (
      <div className="medicines-reminders-container">
        {medicineRemindersList.length > 0 ? (
          <>
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
          </>
        ) : (
          <EmptyView
            msg={
              "No reminders yet. Please add new reminders to view them here."
            }
          />
        )}
      </div>
    );
  };

  render() {
    return (
      <div>
        <NavBar />
        <div className="reminders-body">{this.renderRemindersSwitch()}</div>
      </div>
    );
  }
}
export default Reminders;
