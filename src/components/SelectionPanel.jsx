import PropTypes from "prop-types";

export default function SelectionPanel({
  consignationTypes,
  isGuided,
  onSubmit,
  onTick,
  isTickDisabled,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-center justify-center mb-4 border-b"
    >
      <select
        name="consignation-type"
        className="border m-2 mb-4 rounded-lg hover:ring-2 hover:ring-[color:var(--enedis-blue)] focus:ring-[color:var(--enedis-blue)] focus:ring-2"
      >
        <option value="" className="bg-slate-100">
          --Choisir un type de consignation--
        </option>
        {consignationTypes.map((consignationType) => {
          return (
            <option
              value={consignationType.type}
              key={consignationType.type}
              className="active:bg-[color:var(--enedis-blue)] hover:text-white"
            >
              Consignation {consignationType.type.toUpperCase()}
            </option>
          );
        })}
      </select>
      <div>
        <input
          type="checkbox"
          name="guidance"
          id="guidance"
          checked={isGuided}
          onChange={onTick}
          disabled={isTickDisabled()}
        />
        <label className="mx-1" htmlFor="guidance">
          Consignation assistée
        </label>
      </div>
      <button
        type="submit"
        className="bg-[color:var(--enedis-green)] m-2 mb-8 p-2 rounded-lg hover:ring-2 hover:ring-[color:var(--enedis-blue)] active:bg-[color:var(--enedis-blue)]"
      >
        Confirmer
      </button>
    </form>
  );
}

SelectionPanel.propTypes = {
  consignationTypes: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  isGuided: PropTypes.bool.isRequired,
  onTick: PropTypes.func.isRequired,
  isTickDisabled: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
