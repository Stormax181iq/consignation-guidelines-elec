import PropTypes from "prop-types";

export default function IncompleteTasksDisplay({
  rawShownTodos,
  rawShownRequiredElements,
  onCheckbox,
  onMakeUnique,
}) {
  const jsxTodos = rawShownTodos
    ? onMakeUnique(rawShownTodos)
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

  const jsxRequiredElements = rawShownRequiredElements
    ? onMakeUnique(rawShownRequiredElements)
        .flatMap((requiredElement) => {
          if (!requiredElement.done) {
            return (
              <div className="ml-2" key={requiredElement.id}>
                <input
                  type="checkbox"
                  id={requiredElement.id}
                  checked={requiredElement.done}
                  onChange={() =>
                    onCheckbox(requiredElement.id, requiredElement.id, "rE")
                  }
                />
                <label htmlFor={requiredElement.id}>
                  {requiredElement.description}
                </label>
              </div>
            );
          } else {
            return null;
          }
        })
        .filter((requiredElement) => requiredElement !== null)
    : null;

  return (
    <aside className="bg-slate-50 border-2 border-black p-2 rounded-lg mb-2 overflow-y-scroll max-h-96">
      <h1 className="text-xl font-bold">Tâches incomplètes :</h1>
      {jsxTodos.length > 0 && (
        <>
          <h2 className="text-xl font-medium">À faire :</h2>
          {jsxTodos}
        </>
      )}
      {jsxRequiredElements.length > 0 && (
        <>
          <h2 className="text-xl font-medium">Requis :</h2>
          {jsxRequiredElements}
        </>
      )}
    </aside>
  );
}

IncompleteTasksDisplay.propTypes = {
  rawShownTodos: PropTypes.arrayOf(PropTypes.object.isRequired),
  rawShownRequiredElements: PropTypes.arrayOf(PropTypes.object.isRequired),
  onCheckbox: PropTypes.func,
  onMakeUnique: PropTypes.func,
};
