import "./index.css";

const MedicineUnitButtonItem = (props) => {
  const { buttonDetails, onUnitsTypeChange, isActive } = props;
  const { id, value } = buttonDetails;
  const isActiveClassname = isActive ? "unit-btn-active" : "";
  return (
    <li>
      <button
        type="button"
        className={`unit-btn ${isActiveClassname}`}
        onClick={() => onUnitsTypeChange(id)}
      >
        {value}
      </button>
    </li>
  );
};
export default MedicineUnitButtonItem;
