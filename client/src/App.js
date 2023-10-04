import React from "react"
import './App.css';
import Home from './Home'
import ReactDemo from './ReactDemo'
import DataDisplay from './DataDisplay'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';


function App() {
  return (
   <div className="App" >
    <Router>
      <Routes>
        <Route exact path="/" element ={<Home/>}/>
        <Route exact path="/DataDisplay" element ={<DataDisplay/>}/>
        <Route exact path="/reactdemo" element ={<ReactDemo/>}/>
      </Routes>
    </Router>

    </div>
  );
}


export default App;


