import "./index.css";
import { Component } from "react";
import Cookies from "js-cookie";
import NavBar from "../NavBar";
import LoaderItem from "../LoaderItem";
import AppointmentItem from "../AppointmentItem";
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
    appointmentsApiStatus: apiStatusOptions.initial,
    medicineRemindersApiStatus: apiStatusOptions.initial,
    medicineRemindersList: [],
    appointmentsList: [],
  };

  componentDidMount() {
    this.getRemindersList();
  }

  getRemindersList = async () => {
    this.setState({
      medicineRemindersApiStatus: apiStatusOptions.isLoading,
      appointmentsApiStatus: apiStatusOptions.isLoading,
    });
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
      const { medicineReminders, appointments } = data;
      const formattedMedicineRemindersData = medicineReminders.map(
        (eachReminder) => ({
          id: eachReminder.id,
          medicineName: eachReminder.medicine_name,
          medicineType: eachReminder.medicine_type,
          units: eachReminder.units,
          unitsType: eachReminder.units_type,
          intakeTime: eachReminder.intake_time,
          checked: eachReminder.checked,
        })
      );
      const formattedAppointmentData = appointments.map((eachAppointment) => ({
        id: eachAppointment.id,
        appointmentWith: eachAppointment.appointment_with,
        appointmentVenue: eachAppointment.appointment_venue,
        date: eachAppointment.date,
        Checked: eachAppointment.checked,
      }));
      this.setState({
        medicineRemindersApiStatus: apiStatusOptions.success,
        appointmentsApiStatus: apiStatusOptions.success,
        medicineRemindersList: formattedMedicineRemindersData,
        appointmentsList: formattedAppointmentData,
      });
    } else {
      this.setState({
        medicineRemindersApiStatus: apiStatusOptions.failure,
        appointmentsApiStatus: apiStatusOptions.failure,
      });
    }
  };

  deleteCheckedAppointments = async () => {
    const jwtToken = Cookies.get("jwt_token");
    const url = "/reminders/appointments";
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    await fetch(url, options);
    this.getRemindersList();
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
    this.getRemindersList();
  };

  renderAppointmentsSwitch = () => {
    const { appointmentsApiStatus } = this.state;
    switch (appointmentsApiStatus) {
      case apiStatusOptions.isLoading:
        return <LoaderItem />;
      case apiStatusOptions.success:
        return this.renderAppointments();
      case apiStatusOptions.failure:
        return <p>Something Went Wrong</p>;
      default:
        return null;
    }
  };

  renderAppointments = () => {
    const { appointmentsList } = this.state;
    return (
      <div className="medicines-reminders-container">
        {appointmentsList.length > 0 ? (
          <>
            <button
              type="button"
              className="delete-checked-btn"
              onClick={this.deleteCheckedAppointments}
            >
              Delete Checked
            </button>
            <ul className="medicines-reminders-list">
              {appointmentsList.map((eachReminder) => (
                <AppointmentItem
                  key={eachReminder.id}
                  appointmentDetails={eachReminder}
                  getRemindersList={this.getRemindersList}
                />
              ))}
            </ul>
          </>
        ) : (
          <EmptyView
            msg={
              "No Appointments yet. Please add new appointment to view them here."
            }
          />
        )}
      </div>
    );
  };

  renderMedicineRemindersSwitch = () => {
    const { medicineRemindersApiStatus } = this.state;
    switch (medicineRemindersApiStatus) {
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
                  getRemindersList={this.getRemindersList}
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
        <div className="reminders-body">
          {this.renderAppointmentsSwitch()}
          {this.renderMedicineRemindersSwitch()}
        </div>
      </div>
    );
  }
}
export default Reminders;
