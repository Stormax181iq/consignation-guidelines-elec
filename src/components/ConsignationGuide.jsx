import { useState, useEffect } from "react";

import PropTypes from "prop-types";
import AlertDialog from "./AlertDialog.jsx";

import ConsignationCard from "./ConsignationCard.jsx";
import IncompleteTasksDisplay from "./IncompleteTasksDisplay.jsx";

export default function ConsignationGuide({
  consignation,
  onResetConsignation,
}) {
  const [consignationSteps, setConsignationSteps] = useState(null);

  const shownSteps = consignationSteps
    ? consignationSteps.filter((step) => step.shown === true)
    : null;
  const stepsWithTodos = shownSteps
    ? shownSteps.filter((step) => step.todos)
    : null;
  const stepsWithRequiredElements = shownSteps
    ? shownSteps.filter((step) => step.requiredElements)
    : null;
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

  return (
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
            stepsWithTodos={stepsWithTodos}
            stepsWithRequiredElements={stepsWithRequiredElements}
            onCheckbox={handleCheckbox}
          />

          <AlertDialog
            onAction={onResetConsignation}
            isDisabled={
              // If everything is ticked, the button is enabled, and reciprocally
              stepsWithTodos
                .map((step) => {
                  return step.todos.filter((todo) => !todo.done).length === 0;
                })
                .includes(false) ||
              stepsWithRequiredElements
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
            buttonText="Valider"
          />
        </div>
      )}
    </div>
  );
}

ConsignationGuide.propTypes = {
  consignation: PropTypes.string.isRequired,
  onResetConsignation: PropTypes.func.isRequired,
};
