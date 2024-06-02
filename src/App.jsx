import { useState, useEffect } from "react";

import SelectionPanel from "./components/SelectionPanel";
import ConsignationGuide from "./components/ConsignationGuide";

export default function App() {
  const [consignationTypes, setConsignationTypes] = useState(null);
  const [currentConsignation, setCurrentConsignation] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setCurrentConsignation(e.target.children[0].value);
  }

  function handleResetConsignation() {
    setCurrentConsignation("");
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
            onSubmit={handleSubmit}
          />
        ) : (
          <p>Chargement ...</p>
        )}
      </header>
      <main className="mx-2">
        {currentConsignation !== "" && (
          <ConsignationGuide
            consignation={currentConsignation}
            onResetConsignation={handleResetConsignation}
          />
        )}
      </main>
    </>
  );
}
