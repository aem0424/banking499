import React, { useState, useEffect } from "react"; // Import useState and useEffect

import logo from './logo.svg';
import './App.css';

function ReactDemo() { // Rename to start with an uppercase letter
  const [data, setData] = useState(null); // Use useState and useEffect

  useEffect(() => { // Use useEffect
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
        <p>Demo</p>
      </header>
    </div>
  );
}

export default ReactDemo; // Export with the corrected component name
