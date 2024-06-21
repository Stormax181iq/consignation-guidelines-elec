import PropTypes from "prop-types";

export default function TicksCard({ rawShownTicks, onCheckbox, onMakeUnique }) {
  const jsxTicks = rawShownTicks
    ? onMakeUnique(rawShownTicks)
        .flatMap((todo) => {
          if (!todo.done) {
            return (
              <div className="ml-2" key={todo.id}>
                <input
                  type="checkbox"
                  id={todo.id}
                  checked={todo.done}
                  onChange={() => onCheckbox(todo.id, todo.id, "td")}
                />
                <label htmlFor={todo.id}>{todo.description}</label>
              </div>
            );
          } else {
            return null;
          }
        })
        .filter((todo) => todo !== null)
    : null;

  return (
    <div className="bg-slate-50 border-black border-2 rounded-lg p-2 mb-4">
      <h1 className="text-sl font-bold">Coches LEIA :</h1>
      {jsxTicks}
    </div>
  );
}

TicksCard.propTypes = {
  rawShownTicks: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCheckbox: PropTypes.func.isRequired,
  onMakeUnique: PropTypes.func.isRequired,
};
