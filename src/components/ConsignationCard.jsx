import PropTypes from "prop-types";

export default function ConsignationCard({
  stepId,
  consignationSteps,
  onToggleDisplay,
  onCheckbox,
}) {
  const currentStep = consignationSteps.filter((step) => step.id === stepId)[0];
  const todos = currentStep.todos;
  const requiredElements = currentStep.requiredElements;
  const nextSteps = currentStep.nextSteps;
  const title = currentStep.title;
  const type = currentStep.type;

  return (
    <div className="border">
      <h1>{type.toUpperCase() + " - " + title}</h1>
      {stepId !== 0 && (
        <button onClick={() => onToggleDisplay(stepId)} className="w-6">
          <img
            src="./img/xmark-svgrepo.png"
            alt="x-mark"
            srcSet="./img/xmark-svgrepo.svg"
          />
        </button>
      )}
      {todos && (
        <>
          <h2>À faire :</h2>
          {todos.map((todo) => {
            return (
              <div className="ml-2" key={`${stepId}${todo.id}t`}>
                <input
                  type="checkbox"
                  id={`${stepId}${todo.id}t`}
                  checked={todo.done}
                  onChange={() => onCheckbox(currentStep.id, todo.id, "t")}
                />
                <label htmlFor={`${stepId}${todo.id}t`}>
                  {todo.description}
                </label>
              </div>
            );
          })}
        </>
      )}
      {requiredElements && (
        <>
          <h2>Requis :</h2>
          {requiredElements.map((requiredElem) => {
            return (
              <div className="ml-2" key={`${stepId}${requiredElem.id}re`}>
                <input
                  type="checkbox"
                  id={`${stepId}${requiredElem.id}re`}
                  checked={requiredElem.done}
                  onChange={() =>
                    onCheckbox(currentStep.id, requiredElem.id, "rE")
                  }
                />
                <label htmlFor={`${stepId}${requiredElem.id}re`}>
                  {requiredElem.description}
                </label>
              </div>
            );
          })}
        </>
      )}
      {nextSteps && (
        <>
          <h2>Étapes suivantes :</h2>
          {nextSteps.map((id) => {
            const nextTitle = consignationSteps.map((consignationStep) => {
              if (consignationStep.id === id) {
                return consignationStep.title;
              } else {
                return null;
              }
            });
            return (
              <div className="ml-2" key={nextTitle}>
                <input
                  type="checkbox"
                  id={nextTitle}
                  disabled={
                    requiredElements
                      ? requiredElements.filter((rE) => !rE.done).length
                      : false
                  }
                  checked={consignationSteps
                    .map((consignationStep) => {
                      if (consignationStep.id === id) {
                        return consignationStep.shown;
                      } else {
                        return null;
                      }
                    })
                    .includes(true)}
                  onChange={() => onToggleDisplay(id)}
                />
                <label htmlFor={nextTitle}>{nextTitle}</label>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

ConsignationCard.propTypes = {
  consignationSteps: PropTypes.arrayOf(PropTypes.object.isRequired),
  onToggleDisplay: PropTypes.func,
  stepId: PropTypes.number,
  onCheckbox: PropTypes.func,
};
