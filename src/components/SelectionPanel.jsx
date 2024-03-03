import PropTypes from "prop-types";

export default function SelectionPanel({ consignationTypes }) {
  function handleSubmit(e) {
    e.preventDefault();
  }

  function handleClick() {
    // TODO Complete
  }

  return (
    <form onSubmit={handleSubmit}>
      <select name="consignation-type">
        <option value="">--Choisir un type de consignation--</option>
        {consignationTypes.map((consignationType) => {
          return (
            <option value={consignationType.name} key={consignationType.name}>
              Consignation {consignationType.name.toUpperCase()}
            </option>
          );
        })}
      </select>
      <button onClick={handleClick} type="submit">
        Confirmer
      </button>
    </form>
  );
}

SelectionPanel.propTypes = {
  consignationTypes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};
