import "./index.css";
import { Component } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsCalendar3 } from "react-icons/bs";
import Cookies from "js-cookie";

class AppointmentItem extends Component {
  state = { isChecked: false };

  componentDidMount() {
    const { appointmentDetails } = this.props;
    const { checked } = appointmentDetails;
    this.setState({ isChecked: checked });
  }

  onCheckboxChange = async (event, id) => {
    this.setState((prevState) => ({ isChecked: !prevState.isChecked }));
    const jwtToken = Cookies.get("jwt_token");
    const url = `/reminders/appointment/${id}`;
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

  deleteAppointment = async (id, getRemindersList) => {
    const jwtToken = Cookies.get("jwt_token");
    const url = `/reminders/appointment/${id}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    await fetch(url, options);
    getRemindersList();
  };

  render() {
    const { appointmentDetails, getRemindersList } = this.props;
    const { isChecked } = this.state;
    const { id, appointmentWith, appointmentVenue, date } = appointmentDetails;
    const formattedDatetime = format(new Date(date), "MMM d hh:mm a");
    const greaterDate = new Date(date);
    const now = new Date();
    const remainingTime =
      greaterDate > now ? `in ${formatDistanceToNow(new Date(date))}` : "now";
    return (
      <li className="appointment-reminder-item">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(event) => this.onCheckboxChange(event, id)}
        />
        <div className="appointment-text">
          <h1 className="appointment-heading">
            Appointment - {appointmentWith} at {appointmentVenue}
          </h1>
          <h1 className="appointment-heading datetime">
            <BsCalendar3 size={13} /> {formattedDatetime}
          </h1>
          <p className="appointment-time">
            This appointment is {remainingTime}
          </p>
        </div>
        <button
          type="button"
          className="delete-btn"
          onClick={() => this.deleteAppointment(id, getRemindersList)}
        >
          <RiDeleteBin6Line size={20} color={"#4a95eb"} />
        </button>
      </li>
    );
  }
}
export default AppointmentItem;
