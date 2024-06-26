import { useState, useEffect } from "react";

import SelectionPanel from "./components/SelectionPanel";
import ConsignationGuide from "./components/ConsignationGuide";

export default function App() {
  const [consignationTypes, setConsignationTypes] = useState(null);
  const [currentConsignation, setCurrentConsignation] = useState(null);
  const [isGuided, setIsGuided] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setCurrentConsignation(
      e.target.children[0].children[0].value === ""
        ? null
        : e.target.children[0].children[0].value
    );
  }

  function handleTick() {
    setIsGuided(!isGuided);
  }
  function isTickDisabled() {
    return currentConsignation !== null;
  }

  function handleResetConsignation(e) {
    e.preventDefault();
    setCurrentConsignation(null);
  }

  function displayConsignationGuide() {
    if (currentConsignation) {
      return isGuided ? (
        <ConsignationGuide
          consignation={currentConsignation}
          onResetConsignation={handleResetConsignation}
        />
      ) : (
        <img src={getImagePath()} alt="Consignation Guide Diagram" />
      );
    } else {
      return (
        <div className="flex flex-col justify-center w-72">
          <img src="assets/logo-enedis.webp" alt="Enedis logo" />
          <img src="assets/Blason_Languedoc.svg" alt="Blason Languedoc" />
        </div>
      );
    }
  }

  function getImagePath() {
    return "assets/guides/" + currentConsignation.toLowerCase() + "Guide.png";
  }

  useEffect(() => {
    let ignore = false;
    (async () => {
      const data = await fetch("./data/consignationTypes.json").then(
        (response) => response.json()
      );

      if (!ignore) {
        setConsignationTypes(data);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);
  return (
    <>
      <header>
        {consignationTypes ? (
          <SelectionPanel
            consignationTypes={consignationTypes.consignationTypes}
            isGuided={isGuided}
            onSubmit={handleSubmit}
            onTick={handleTick}
            onResetConsignation={handleResetConsignation}
            isTickDisabled={isTickDisabled}
          />
        ) : (
          <p>Chargement ...</p>
        )}
      </header>
      <main className="mx-2 flex justify-center">
        {displayConsignationGuide()}
      </main>
    </>
  );
}
