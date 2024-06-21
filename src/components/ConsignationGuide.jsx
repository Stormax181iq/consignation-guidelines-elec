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

  const rawShownTodos = shownSteps
    ? shownSteps
        .filter((step) => step.todos)
        .flatMap((step) => {
          return step.todos.map((todo) => {
            return {
              id: formatId(step.id, todo.id, "td"),
              description: todo.description,
              done: todo.done,
            };
          });
        })
    : null;
  const rawTodos = consignationSteps
    ? consignationSteps
        .filter((step) => step.todos)
        .flatMap((step) => {
          return step.todos.map((todo) => {
            return {
              id: formatId(step.id, todo.id, "td"),
              description: todo.description,
              done: todo.done,
            };
          });
        })
    : null;

  const rawShownRequiredElements = shownSteps
    ? shownSteps
        .filter((step) => step.requiredElements)
        .flatMap((step) => {
          return step.requiredElements.map((requiredElement) => {
            return {
              id: formatId(step.id, requiredElement.id, "re"),
              description: requiredElement.description,
              done: requiredElement.done,
            };
          });
        })
    : null;
  const rawRequiredElements = consignationSteps
    ? consignationSteps
        .filter((step) => step.requiredElements)
        .flatMap((step) => {
          return step.requiredElements.map((requiredElement) => {
            return {
              id: formatId(step.id, requiredElement.id, "re"),
              description: requiredElement.description,
              done: requiredElement.done,
            };
          });
        })
    : null;

  const rawShownTicks = shownSteps
    ? shownSteps
        .filter((step) => step.ticks)
        .flatMap((step) => {
          return step.ticks.map((tick) => {
            return {
              id: formatId(step.id, tick.id, "tk"),
              description: tick.description,
              done: tick.done,
            };
          });
        })
    : null;
  const rawTicks = consignationSteps
    ? consignationSteps
        .filter((step) => step.ticks)
        .flatMap((step) => {
          return step.ticks.map((tick) => {
            return {
              id: formatId(step.id, tick.id, "tk"),
              description: tick.description,
              done: tick.done,
            };
          });
        })
    : null;

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

  function formatId(stepId, checkboxId, type) {
    return `${stepId}/${checkboxId}.${type}`;
  }

  function makeUnique(arrOfObjects) {
    const seen = new Set();
    return arrOfObjects.filter((item) => {
      const alreadySeen = seen.has(item.description);
      seen.add(item.description);
      return !alreadySeen;
    });
  }

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
      case "td":
        handleTodoCheckbox(stepId, checkboxId);
        break;
      case "rE":
        handleRequiredElementCheckbox(stepId, checkboxId);
        break;
      case "tk":
        handleTickCheckbox(stepId, checkboxId);
        break;
      default:
        break;
    }
  }

  function handleTodoCheckbox(stepId, checkboxId) {
    rawTodos.forEach((rawTodo) => {
      if (rawTodo.id === formatId(stepId, checkboxId, "td")) {
        setConsignationSteps(
          consignationSteps.map((consignationStep) => {
            return {
              ...consignationStep,
              todos: toggleDone(consignationStep.todos, rawTodo.description),
            };
          })
        );
      }
    });
  }

  function handleRequiredElementCheckbox(stepId, checkboxId) {
    rawRequiredElements.forEach((rawRequiredElement) => {
      if (rawRequiredElement.id === formatId(stepId, checkboxId, "re")) {
        setConsignationSteps(
          consignationSteps.map((consignationStep) => {
            return {
              ...consignationStep,
              requiredElements: toggleDone(
                consignationStep.requiredElements,
                rawRequiredElement.description
              ),
            };
          })
        );
      }
    });
  }

  function handleTickCheckbox(stepId, checkboxId) {
    rawTicks.forEach((rawTick) => {
      if (rawTick.id === formatId(stepId, checkboxId, "tk")) {
        setConsignationSteps(
          consignationSteps.map((consignationStep) => {
            return {
              ...consignationStep,
              ticks: toggleDone(consignationStep.ticks, rawTick.description),
            };
          })
        );
      }
    });
  }

  function toggleDone(items, description) {
    return items
      ? items.map((item) => {
          if (item.description === description) {
            return {
              ...item,
              done: !item.done,
            };
          } else {
            return item;
          }
        })
      : null;
  }

  return (
    <>
      {isTickPhase ? (
        <div className="flex flex-col items-center">
          <TicksCard
            rawShownTicks={rawShownTicks}
            onCheckbox={handleCheckbox}
            onFormatId={formatId}
            onMakeUnique={makeUnique}
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
                      onFormatId={formatId}
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
                rawShownTodos={rawShownTodos}
                rawShownRequiredElements={rawShownRequiredElements}
                onCheckbox={handleCheckbox}
                onFormatId={formatId}
                onMakeUnique={makeUnique}
              />

              <AlertDialog
                onAction={() => setIsTickPhase(true)}
                isDisabled={
                  // If everything is ticked, the button is enabled, and reciprocally
                  rawShownRequiredElements
                    .map((requiredElement) => {
                      return requiredElement.done;
                    })
                    .includes(false) ||
                  !consignationSteps[consignationSteps.length - 1].shown
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
