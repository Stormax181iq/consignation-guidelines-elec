import { useState, useEffect } from "react";

import SelectionPanel from "./components/SelectionPanel";

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      const data = await fetch("./data/consignationData.json").then(
        (response) => response.json()
      );

      if (!ignore) {
        setData(data);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);
  return <SelectionPanel consignationTypes={data.consignationTypes} />;
}
