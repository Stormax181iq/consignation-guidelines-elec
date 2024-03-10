import { useState, useEffect } from "react";

import PropTypes from "prop-types";

export default function ConsignationGuide({ consignation }) {
  const [consignationSteps, setConsignationSteps] = useState(null);

  const consignationTitles = consignationSteps
    ? consignationSteps.map((step) => {
        return {
          id: step.id,
          title: step.title,
        };
      })
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

  return (
    <>
      {consignationSteps
        ? consignationSteps.map((step) => {
            if (step.id !== 0) {
              return null;
            } else {
              return step.title ? (
                <ConsignationCard
                  key={step.id}
                  step={step}
                  consignationTitles={consignationTitles}
                />
              ) : (
                <p>Pas encore disponible</p>
              );
            }
          })
        : null}
    </>
  );
}

function ConsignationCard({ step, consignationTitles }) {
  const todos = step.todos;
  const requiredElements = step.requiredElements;
  const nextSteps = step.nextSteps;

  return (
    <div className="border">
      <h1>{step.type.toUpperCase() + " - " + step.title}</h1>
      {todos && (
        <>
          <h2>À faire :</h2>
          {todos.map((todo) => {
            return (
              <div className="ml-2" key={todo.id}>
                <input type="checkbox" id={todo.description} />
                <label htmlFor={todo.description}>{todo.description}</label>
              </div>
            );
          })}
          <h2>Requis :</h2>
          {requiredElements.map((requiredElem) => {
            return (
              <div className="ml-2" key={requiredElem.id}>
                <input type="checkbox" id={requiredElem.description} />
                <label htmlFor={requiredElem.description}>
                  {requiredElem.description}
                </label>
              </div>
            );
          })}
          <h2>Étapes suivantes :</h2>
          {nextSteps.map((id) => {
            const nextTitle = consignationTitles.map((titleObject) => {
              if (titleObject.id === id) {
                return titleObject.title;
              } else {
                return null;
              }
            });
            return <p key={id}>{nextTitle}</p>;
          })}
        </>
      )}
    </div>
  );
}

ConsignationGuide.propTypes = {
  consignation: PropTypes.string.isRequired,
};

ConsignationCard.propTypes = {
  step: PropTypes.object.isRequired,
  consignationTitles: PropTypes.arrayOf(PropTypes.object.isRequired),
};
