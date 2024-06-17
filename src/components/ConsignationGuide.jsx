import { useState, useEffect } from "react";

import PropTypes from "prop-types";
import AlertDialog from "./AlertDialog.jsx";

import ConsignationCard from "./ConsignationCard.jsx";
import IncompleteTasksDisplay from "./IncompleteTasksDisplay.jsx";
import TicksCard from "./TicksCard.jsx";

export default function ConsignationGuide({
  consignation,
  onResetConsignation,
}) {
  const [consignationSteps, setConsignationSteps] = useState(null);
  const [isTickPhase, setIsTickPhase] = useState(null);

  const shownSteps = consignationSteps
    ? consignationSteps.filter((step) => step.shown === true)
    : null;
  const shownStepsWithTodos = shownSteps
    ? shownSteps.filter((step) => step.todos)
    : null;
  const shownStepsWithRequiredElements = shownSteps
    ? shownSteps.filter((step) => step.requiredElements)
    : null;
  // TODO : try passing a raw list of todos to the IncompleteTasksDisplay in order to simplify.
  // You should probably have to find the corresponding todo within consignationSteps to check it
  // (maybe not because of the id of the checkbox). todo
  const rawShownTodos = shownStepsWithTodos
    ? shownStepsWithTodos.flatMap((step) => {
        return step.todos.map((todo) => {
          return {
            id: `${step.id}/${todo.id}.td`,
            description: todo.description,
            done: todo.done,
          };
        });
      })
    : null;
  console.table(rawShownTodos); //TODO temporary

  useEffect(() => {
    // Consignation type change entails modification of current state data
    let ignore = false;
    (async () => {
      const data = await fetch(
        `./data/${consignation}ConsignationSteps.json`
      ).then((response) => response.json());
      if (!ignore) {
        setConsignationSteps(data.steps);
        setIsTickPhase(false);
      }
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

  // TODO modify handleCheckbox() to tick other todos with the same description (use the rawTodos)
  function handleCheckbox(stepId, checkboxId, category) {
    switch (category) {
      case "td":
        // rawShownTodos.map((rawTodo) => {
        //   if (rawTodo.id === checkboxId) {
        //   }
        // });
        // testing code above ; former code below
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
      case "tk":
        setConsignationSteps(
          consignationSteps.map((consignationStep) => {
            if (consignationStep.id === stepId) {
              return {
                ...consignationStep,
                ticks: consignationStep.ticks.map((tick) => {
                  if (tick.id === checkboxId) {
                    return {
                      ...tick,
                      done: !tick.done,
                    };
                  } else {
                    return tick;
                  }
                }),
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

  return (
    <>
      {isTickPhase ? (
        <div className="flex flex-col items-center">
          <TicksCard
            shownConsignationSteps={shownSteps}
            onCheckbox={handleCheckbox}
          />
          <AlertDialog
            onAction={onResetConsignation}
            isDisabled={false}
            title="Terminer la consignation ?"
            content="Cette action est irréversible."
            enabledButtonText="Terminer la consignation"
            disabledButtonText="Terminer la consignation"
            dialogButtonText="Terminer"
          />
        </div>
      ) : (
        <div className="w-screen mx-4 grid grid-cols-2">
          <div>
            {consignationSteps ? (
              consignationSteps.map((step) => {
                if (step.shown) {
                  return step.title ? (
                    <ConsignationCard
                      key={step.id}
                      stepId={step.id}
                      consignationSteps={consignationSteps}
                      onToggleDisplay={handleToggleDisplay}
                      onCheckbox={handleCheckbox}
                    />
                  ) : null;
                } else {
                  return null;
                }
              })
            ) : (
              <p key="error-not-available">Pas encore disponible</p>
            )}
          </div>
          {consignationSteps && (
            <div className="flex flex-col justify-self-end w-1/3 fixed mr-12">
              <IncompleteTasksDisplay
                rawTodos={rawShownTodos}
                stepsWithTodos={shownStepsWithTodos}
                stepsWithRequiredElements={shownStepsWithRequiredElements}
                onCheckbox={handleCheckbox}
              />

              <AlertDialog
                onAction={() => setIsTickPhase(true)}
                isDisabled={
                  // If everything is ticked, the button is enabled, and reciprocally
                  shownStepsWithTodos
                    .map((step) => {
                      return (
                        step.todos.filter((todo) => !todo.done).length === 0
                      );
                    })
                    .includes(false) ||
                  shownStepsWithRequiredElements
                    .map((step) => {
                      return (
                        step.requiredElements.filter(
                          (requiredElement) => !requiredElement.done
                        ).length === 0
                      );
                    })
                    .includes(false)
                }
                title="Valider la consignation ?"
                content="La consignation actuelle sera supprimée. Cette action est
    irréversible."
                enabledButtonText="Je peux valider mon accès"
                disabledButtonText="Je ne peux pas valider mon accès"
                dialogButtonText="Valider"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

ConsignationGuide.propTypes = {
  consignation: PropTypes.string.isRequired,
  onResetConsignation: PropTypes.func.isRequired,
};
