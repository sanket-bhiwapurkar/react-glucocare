import "./index.css";
import { Component } from "react";
import { formatDistanceToNow } from "date-fns";
import { CiTablets1 } from "react-icons/ci";
import { RiSyringeLine } from "react-icons/ri";
import { GiPill } from "react-icons/gi";
import { TbMedicineSyrup } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import Cookies from "js-cookie";

class MedicineReminderItem extends Component {
  state = { isChecked: false };

  componentDidMount() {
    const { reminderDetails } = this.props;
    const { checked } = reminderDetails;
    this.setState({ isChecked: checked });
  }

  onCheckboxChange = async (event, id) => {
    this.setState((prevState) => ({ isChecked: !prevState.isChecked }));
    const jwtToken = Cookies.get("jwt_token");
    const url = `/reminders/medicine/${id}`;
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

  deleteReminder = async (id, getMedicineRemindersList) => {
    const jwtToken = Cookies.get("jwt_token");
    const url = `/reminders/medicine/${id}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    await fetch(url, options);
    getMedicineRemindersList();
  };

  renderMedicineType = (medicineType) => {
    switch (medicineType) {
      case "Tablet":
        return <CiTablets1 size={18} />;
      case "Syringe":
        return <RiSyringeLine size={18} />;
      case "Pill":
        return <GiPill size={18} />;
      case "Syrup":
        return <TbMedicineSyrup size={18} />;

      default:
        return null;
    }
  };

  render() {
    const { reminderDetails, getMedicineRemindersList } = this.props;
    const { isChecked } = this.state;
    const { id, medicineName, medicineType, units, unitsType, intakeTime } =
      reminderDetails;
    const greaterDate = new Date(intakeTime);
    const now = new Date();
    const remainingTime =
      greaterDate > now
        ? `in ${formatDistanceToNow(new Date(intakeTime))}`
        : "now";
    return (
      <li className="medicine-reminder-item">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(event) => this.onCheckboxChange(event, id)}
        />
        <div className="reminder-text">
          <h1 className="reminder-heading">Medication - {medicineName}</h1>
          <div className="medicine-type-container">
            <p className="reminder-heading">
              {units} {unitsType}
            </p>
            {this.renderMedicineType(medicineType)}
          </div>
          <p className="remainder-time">
            Please take your next Dose {remainingTime}
          </p>
        </div>
        <button
          type="button"
          className="delete-btn"
          onClick={() => this.deleteReminder(id, getMedicineRemindersList)}
        >
          <RiDeleteBin6Line size={20} />
        </button>
      </li>
    );
  }
}
export default MedicineReminderItem;
