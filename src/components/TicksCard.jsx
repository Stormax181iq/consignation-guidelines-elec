import PropTypes from "prop-types";

export default function TicksCard({
  rawShownTodos,
  rawShownTicks,
  onCheckbox,
  onMakeUnique,
}) {
  const jsxTodos = rawShownTodos
    ? onMakeUnique(rawShownTodos).flatMap((todo) => {
        return (
          <div className="ml-2">
            <input
              type="checkbox"
              id={todo.id}
              checked={todo.done}
              onChange={() => onCheckbox("td", todo.id)}
            />
            <label htmlFor={todo.id}>{todo.description}</label>
          </div>
        );
      })
    : null;
  const jsxTicks = rawShownTicks
    ? onMakeUnique(rawShownTicks).flatMap((tick) => {
        return (
          <div className="ml-2" key={tick.id}>
            <input
              type="checkbox"
              id={tick.id}
              checked={tick.done}
              onChange={() => onCheckbox("tk", tick.id)}
            />
            <label htmlFor={tick.id}>{tick.description}</label>
          </div>
        );
      })
    : null;
  return (
    <div className="bg-slate-50 border-black border-2 rounded-lg p-2 mb-4">
      <h1 className="text-sl font-bold">À faire :</h1>
      {jsxTodos}
      <h1 className="text-sl font-bold">Coches LEIA :</h1>
      {jsxTicks}
    </div>
  );
}

TicksCard.propTypes = {
  rawShownTodos: PropTypes.arrayOf(PropTypes.object).isRequired,
  rawShownTicks: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCheckbox: PropTypes.func.isRequired,
  onMakeUnique: PropTypes.func.isRequired,
};
