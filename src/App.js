import logo from "./logo.svg";
import "./App.css";

import { useEffect, useState } from "react";

import {
  catchMonster as catchMonsterMatic,
  isCatchable,
} from "./utils/maticContractMethods.js";
const classId = 1;
function App() {
  const [maticPrice, setMaticPrice] = useState(0);

  useEffect(() => {
    isCatchable(classId).then(({ catchable, price }) => {
      setMaticPrice(price);
      console.log(price);
    });
    window.ethereum.enable();
  }, []);
  const handleCatch = () => {
    catchMonsterMatic(maticPrice, classId, "mymon");
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={handleCatch}>Catch</button>
      </header>
    </div>
  );
}

export default App;
