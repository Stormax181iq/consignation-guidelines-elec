import PropTypes from "prop-types";

export default function SelectionPanel({ consignationTypes, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <select name="consignation-type">
        <option value="">--Choisir un type de consignation--</option>
        {consignationTypes.map((consignationType) => {
          return (
            <option value={consignationType.type} key={consignationType.type}>
              Consignation {consignationType.type.toUpperCase()}
            </option>
          );
        })}
      </select>
      <button type="submit">Confirmer</button>
    </form>
  );
}

SelectionPanel.propTypes = {
  consignationTypes: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
};
