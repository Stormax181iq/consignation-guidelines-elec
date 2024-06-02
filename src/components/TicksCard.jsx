import PropTypes from "prop-types";

export default function TicksCard({ shownConsignationSteps, onCheckbox }) {
  const stepsWithTicks = shownConsignationSteps.filter((step) => step.ticks);

  return (
    <div className="bg-slate-50 border-black border-2 rounded-lg p-2 mb-4">
      <h1 className="text-sl font-bold">Coches LEIA :</h1>
      {stepsWithTicks.map((step) => {
        return step.ticks.map((tick) => {
          return (
            <div key={`${step.id}${tick.id}tk`} className="ml-2">
              <input
                type="checkbox"
                id={`${step.id}${tick.id}tk`}
                checked={tick.done}
                onChange={() => onCheckbox(step.id, tick.id, "tk")}
              />
              <label htmlFor={`${step.id}${tick.id}tk`}>
                {tick.description}
              </label>
            </div>
          );
        });
      })}
    </div>
  );
}

TicksCard.propTypes = {
  shownConsignationSteps: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCheckbox: PropTypes.func.isRequired,
};
