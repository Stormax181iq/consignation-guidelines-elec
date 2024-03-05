import { useState, useEffect } from "react";

import PropTypes from "prop-types";

export default function ConsignationGuide({ consignation }) {
  const [consignationSteps, setConsignationSteps] = useState(null);

  useEffect(() => {
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
              return <ConsignationCard key={step.id} step={step} />;
            }
          })
        : null}
    </>
  );
}

function ConsignationCard({ step }) {
  const todos = step.todos;
  const requiredElements = step.requiredElements;

  return (
    <div className="border flex flex-col">
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
};
