import PropTypes from "prop-types";

export default function IncompleteTasksDisplay({
  stepsWithTodos,
  stepsWithRequiredElements,
  onCheckbox,
}) {
  const jsxTodos = stepsWithTodos
    .flatMap((step) => {
      return step.todos.map((todo) => {
        if (!todo.done) {
          return (
            <div className="ml-2" key={`${step.id}${todo.id}t`}>
              <input
                type="checkbox"
                id={`${step.id}${todo.id}t`}
                checked={todo.done}
                onChange={() => onCheckbox(step.id, todo.id, "t")}
              />
              <label htmlFor={`${step.id}${todo.id}t`}>
                {todo.description}
              </label>
            </div>
          );
        } else {
          return null;
        }
      });
    })
    .filter((step) => step !== null);

  // TODO : when two tasks have the same description, it shouldn't appear twice in the list and their ticked state should be synchronised

  const jsxRequiredElements = stepsWithRequiredElements
    .flatMap((step) => {
      return step.requiredElements.map((requiredElement) => {
        if (!requiredElement.done) {
          return (
            <div className="ml-2" key={`${step.id}${requiredElement.id}re`}>
              <input
                type="checkbox"
                id={`${step.id}${requiredElement.id}re`}
                checked={requiredElement.done}
                onChange={() => onCheckbox(step.id, requiredElement.id, "rE")}
              />
              <label htmlFor={`${step.id}${requiredElement.id}re`}>
                {requiredElement.description}
              </label>
            </div>
          );
        } else {
          return null;
        }
      });
    })
    .filter((rE) => rE !== null);

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
  stepsWithTodos: PropTypes.arrayOf(PropTypes.object.isRequired),
  stepsWithRequiredElements: PropTypes.arrayOf(PropTypes.object.isRequired),
  onCheckbox: PropTypes.func,
};
