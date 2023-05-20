import NavBar from "../NavBar";
import "./index.css";
import { Component } from "react";
import Cookies from "js-cookie";

class AppointmentForm extends Component {
  state = {
    appointmentWith: "",
    appointmentVenue: "",
    appointmentDate: "",
    appointmentTime: "",
  };

  onAppointmentWithChange = (event) => {
    this.setState({ appointmentWith: event.target.value });
  };

  onAppointmentVenueChange = (event) => {
    this.setState({ appointmentVenue: event.target.value });
  };

  onAppointmentDateChange = (event) => {
    this.setState({ appointmentDate: event.target.value });
  };

  onAppointmentTimeChange = (event) => {
    this.setState({ appointmentTime: event.target.value });
  };

  onAddAppointmentClick = async (event) => {
    event.preventDefault();
    const {
      appointmentWith,
      appointmentVenue,
      appointmentDate,
      appointmentTime,
    } = this.state;
    const data = {
      appointmentWith,
      appointmentVenue,
      appointmentDate,
      appointmentTime,
      checked: 0,
    };

    const jwtToken = Cookies.get("jwt_token");

    const url = "/add-appointment";
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
      alert("New Appointment Added");
      const { history } = this.props;
      history.push("/reminders");
    } else {
      alert("Something went Wrong");
    }
  };
  render() {
    const {
      appointmentWith,
      appointmentVenue,
      appointmentDate,
      appointmentTime,
    } = this.state;
    return (
      <div className="appointment-form-bg-container">
        <NavBar />
        <div className="appointment-form-container">
          <form
            className="appointment-form"
            onSubmit={this.onAddAppointmentClick}
          >
            <h1 className="appointment-form-heading">New Appointment</h1>

            <label
              htmlFor="appointment-with"
              className="appointment-form-label"
            >
              APPOINTMENT WITH
            </label>
            <input
              id="appointment-with"
              type="text"
              className="appointment-form-input"
              placeholder="APPOINTMENT WITH"
              value={appointmentWith}
              onChange={this.onAppointmentWithChange}
            />

            <label
              htmlFor="appointment-venue"
              className="appointment-form-label"
            >
              APPOINTMENT VENUE
            </label>
            <input
              id="appointment-venue"
              type="text"
              className="appointment-form-input"
              placeholder="APPOINTMENT VENUE"
              value={appointmentVenue}
              onChange={this.onAppointmentVenueChange}
            />

            <label
              htmlFor="appointment-date"
              className="appointment-form-label"
            >
              APPOINTMENT DATE
            </label>
            <input
              id="appointment-date"
              type="date"
              className="appointment-form-input"
              value={appointmentDate}
              onChange={this.onAppointmentDateChange}
            />

            <label
              htmlFor="appointment-time"
              className="appointment-form-label"
            >
              APPOINTMENT TIME
            </label>
            <input
              id="appointment-time"
              type="time"
              className="appointment-form-input"
              value={appointmentTime}
              onChange={this.onAppointmentTimeChange}
            />

            <button type="submit" className="add-appointment-button">
              Add Appointment
            </button>
          </form>
        </div>
      </div>
    );
  }
}
export default AppointmentForm;
