import React from "react"
import './App.css';
import Home from './Home'
import ForgotPass from './ForgotPass'
import Login from './Login'
import Register from './Register'
import ReactDemo from './ReactDemo'
import DataDisplay from './DataDisplay'
import {Route, Routes} from 'react-router-dom';


function App() {
  return (
   <div className="App" >
    <Routes>
      <Route exact path="/" element ={<Home/>}/>
      <Route exact path="/DataDisplay" element ={<DataDisplay/>}/>
      <Route exact path="/reactdemo" element ={<ReactDemo/>}/>
      <Route exact path="/ForgotPass" element ={<ForgotPass/>}/>
      <Route exact path="/Login" element ={<Login/>}/>
      <Route exact path="/Register" element ={<Register/>}/>
      </Routes>
    </div>
  );
  
}


export default App;


