import { useState, useEffect } from "react";

import PropTypes from "prop-types";
import AlertDialog from "./AlertDialog.jsx";

export default function ConsignationGuide({
  consignation,
  onResetConsignation,
}) {
  const [consignationSteps, setConsignationSteps] = useState(null);
  useEffect(() => {
    // Consignation type change entails modification of current state data
    let ignore = false;
    (async () => {
      const data = await fetch(
        `./data/${consignation}ConsignationSteps.json`
      ).then((response) => response.json());
      if (!ignore) setConsignationSteps(data.steps);
    })();
    return () => {
      ignore = true;
    };
  }, [consignation]);

  function handleToggleDisplay(id) {
    setConsignationSteps(
      consignationSteps.map((consignationStep) => {
        if (consignationStep.id === id) {
          return {
            ...consignationStep,
            shown: !consignationStep.shown,
          };
        } else {
          return consignationStep;
        }
      })
    );
  }

  function handleCheckbox(stepId, checkboxId, category) {
    switch (category) {
      case "t":
        setConsignationSteps(
          consignationSteps.map((consignationStep) => {
            if (consignationStep.id === stepId) {
              return {
                ...consignationStep,
                todos: consignationStep.todos.map((todo) => {
                  if (todo.id === checkboxId) {
                    return {
                      ...todo,
                      done: !todo.done,
                    };
                  } else {
                    return todo;
                  }
                }),
              };
            } else {
              return consignationStep;
            }
          })
        );
        break;
      case "rE":
        setConsignationSteps(
          consignationSteps.map((consignationStep) => {
            if (consignationStep.id === stepId) {
              return {
                ...consignationStep,
                requiredElements: consignationStep.requiredElements.map(
                  (requiredElement) => {
                    if (requiredElement.id === checkboxId) {
                      return {
                        ...requiredElement,
                        done: !requiredElement.done,
                      };
                    } else {
                      return requiredElement;
                    }
                  }
                ),
              };
            } else {
              return consignationStep;
            }
          })
        );
        break;
      default:
        break;
    }
  }

  function validConsignation() {
    onResetConsignation();
  }
  return (
    <>
      {consignationSteps
        ? consignationSteps.map((step) => {
            if (step.shown) {
              return step.title ? (
                <ConsignationCard
                  key={step.id}
                  stepId={step.id}
                  consignationSteps={consignationSteps}
                  onToggleDisplay={handleToggleDisplay}
                  onCheckbox={handleCheckbox}
                />
              ) : (
                <p key="error-not-available">Pas encore disponible</p>
              );
            } else {
              return null;
            }
          })
        : null}
      {consignationSteps && (
        <IncompleteTasksDisplay
          steps={consignationSteps}
          onCheckbox={handleCheckbox}
        />
      )}
      {consignationSteps && (
        <AlertDialog validConsignation={validConsignation} />
      )}
    </>
  );
}

function ConsignationCard({
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
      {todos && (
        <>
          <h2>À faire :</h2>
          {todos.map((todo) => {
            return (
              <div className="ml-2" key={todo.id}>
                <input
                  type="checkbox"
                  id={todo.description}
                  checked={todo.done}
                  onChange={() => onCheckbox(currentStep.id, todo.id, "t")}
                />
                <label htmlFor={todo.description}>{todo.description}</label>
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
              <div className="ml-2" key={requiredElem.id}>
                <input
                  type="checkbox"
                  id={requiredElem.description}
                  checked={requiredElem.done}
                  onChange={() =>
                    onCheckbox(currentStep.id, requiredElem.id, "rE")
                  }
                />
                <label htmlFor={requiredElem.description}>
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

function IncompleteTasksDisplay({ steps, onCheckbox }) {
  const shownSteps = steps.filter((step) => step.shown);
  const stepsWithTodos = shownSteps.filter((step) => step.todos);
  const stepsWithRequiredElements = shownSteps.filter(
    (step) => step.requiredElements
  );

  return (
    <aside className="border">
      <h2>À faire :</h2>
      {stepsWithTodos.map((step) => {
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
      })}
      <h2>Requis :</h2>
      {stepsWithRequiredElements.map((step) => {
        return step.requiredElements.map((requiredElement) => {
          if (!requiredElement.done) {
            return (
              <div className="ml-2" key={requiredElement.id}>
                <input
                  type="checkbox"
                  id={requiredElement.description}
                  checked={requiredElement.done}
                  onChange={() => onCheckbox(step.id, requiredElement.id, "t")}
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
      })}
    </aside>
  );
}

ConsignationGuide.propTypes = {
  consignation: PropTypes.string.isRequired,
};

ConsignationCard.propTypes = {
  consignationSteps: PropTypes.arrayOf(PropTypes.object.isRequired),
  onToggleDisplay: PropTypes.func,
  stepId: PropTypes.number,
  onCheckbox: PropTypes.func,
};

IncompleteTasksDisplay.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.object.isRequired),
  onCheckbox: PropTypes.func,
};
