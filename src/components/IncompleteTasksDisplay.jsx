import PropTypes from "prop-types";

export default function IncompleteTasksDisplay({
  stepsWithTodos,
  stepsWithRequiredElements,
  onCheckbox,
}) {
  const jsxTodos = stepsWithTodos
    .map((step) => {
      return step.todos.map((todo) => {
        if (!todo.done) {
          return (
            <div className="ml-2" key={todo.id}>
              <input
                type="checkbox"
                id={todo.description}
                checked={todo.done}
                onChange={() => onCheckbox(step.id, todo.id, "t")}
              />
              <label htmlFor={todo.description}>{todo.description}</label>
            </div>
          );
        } else {
          return null;
        }
      });
    })
    .filter((step) => step !== null);

  const jsxRequiredElements = stepsWithRequiredElements
    .map((step) => {
      return step.requiredElements.map((requiredElement) => {
        if (!requiredElement.done) {
          return (
            <div className="ml-2" key={requiredElement.id}>
              <input
                type="checkbox"
                id={requiredElement.description}
                checked={requiredElement.done}
                onChange={() => onCheckbox(step.id, requiredElement.id, "rE")}
              />
              <label htmlFor={requiredElement.description}>
                {requiredElement.description}
              </label>
            </div>
          );
        } else {
          return null;
        }
      });
    })
    .filter((step) => step !== null);

  return (
    <aside className="border">
      <h2>À faire :</h2>
      {jsxTodos}
      <h2>Requis :</h2>
      {jsxRequiredElements}
    </aside>
  );
}

IncompleteTasksDisplay.propTypes = {
  stepsWithTodos: PropTypes.arrayOf(PropTypes.object.isRequired),
  stepsWithRequiredElements: PropTypes.arrayOf(PropTypes.object.isRequired),
  onCheckbox: PropTypes.func,
};
