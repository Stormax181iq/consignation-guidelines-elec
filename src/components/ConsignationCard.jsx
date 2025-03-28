import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function ConsignationCard({
  stepId,
  consignationSteps,
  onToggleDisplay,
  onCheckbox,
  onFormatId,
  onHideStep,
}) {
  const currentStep = consignationSteps.filter((step) => step.id === stepId)[0];
  const todos = currentStep.todos;
  const requiredElements = currentStep.requiredElements;
  const nextSteps = currentStep.nextSteps;
  const title = currentStep.title;
  const type = currentStep.type;

  function isAllRequiredElementsChecked() {
    return !requiredElements.filter((rE) => !rE.done).length;
  }
  function isAnyNextStepTicked() {
    return nextSteps
      .flatMap((id) => {
        return consignationSteps.map((consignationStep) => {
          if (consignationStep.id === id) {
            return consignationStep.shown;
          } else {
            return null;
          }
        });
      })
      .includes(true);
  }

  function isNextStepDisabled() {
    if (requiredElements && currentStep.isNextStepUnique) {
      return !isAllRequiredElementsChecked() || isAnyNextStepTicked();
    } else if (requiredElements) {
      return !isAllRequiredElementsChecked();
    } else if (currentStep.isNextStepUnique) {
      return isAnyNextStepTicked();
    } else {
      return false;
    }
  }

  return (
    <div className="bg-slate-50 border-black border-2 rounded-lg p-2 mb-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold inline">
          {type.toUpperCase() + " - " + title}
        </h1>
        {stepId !== 0 && (
          <button
            onClick={() => onToggleDisplay(stepId)}
            className="rounded-lg inline-block w-10 py-1 px-2 hover:bg-slate-200 active:bg-[color:var(--enedis-blue)]"
          >
            <FontAwesomeIcon icon={faXmark} size="2xl" />
          </button>
        )}
      </div>
      {todos && (
        <>
          <h2 className="font-medium text-lg mt-2">À faire :</h2>
          {todos.map((todo) => {
            return (
              <div className="ml-2" key={onFormatId(stepId, todo.id, "td")}>
                <input
                  type="checkbox"
                  id={onFormatId(stepId, todo.id, "td")}
                  checked={todo.done}
                  onChange={() => onCheckbox("td", currentStep.id, todo.id)}
                />
                <label htmlFor={onFormatId(stepId, todo.id, "td")}>
                  {todo.description}
                </label>
              </div>
            );
          })}
        </>
      )}
      {requiredElements && (
        <>
          <h2 className="font-medium text-lg mt-2">Requis :</h2>
          {requiredElements.map((requiredElem) => {
            return (
              <div
                className="ml-2"
                key={onFormatId(stepId, requiredElem.id, "re")}
              >
                <input
                  type="checkbox"
                  id={onFormatId(stepId, requiredElem.id, "re")}
                  checked={requiredElem.done}
                  onChange={() =>
                    onCheckbox("rE", currentStep.id, requiredElem.id)
                  }
                />
                <label htmlFor={onFormatId(stepId, requiredElem.id, "re")}>
                  {requiredElem.description}
                </label>
              </div>
            );
          })}
        </>
      )}
      {nextSteps && (
        <>
          <h2 className="font-medium text-lg mt-2">
            {currentStep.isNextStepUnique
              ? "Étape suivante :"
              : "Étape(s) suivante(s) :"}
          </h2>
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
                  disabled={isNextStepDisabled()}
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
                <button
                  className="rounded-lg mx-1 px-2 py-1 hover:bg-slate-100 active:bg-[color:var(--enedis-blue)]"
                  onClick={() => onHideStep(id)}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
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
  onToggleDisplay: PropTypes.func.isRequired,
  stepId: PropTypes.number.isRequired,
  onCheckbox: PropTypes.func.isRequired,
  onFormatId: PropTypes.func.isRequired,
  onHideStep: PropTypes.func.isRequired,
};
