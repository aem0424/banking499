import React from "react"
import './App.css';
import Home from './/pre/Home'
import ForgotPass from './/pre/ForgotPass'
import Login from './/pre/Login'
import Register from './/pre/Register'
import ReactDemo from './ReactDemo'
import DataDisplay from './DataDisplay'
import CustomerMain from './/customer/CustomerMain'
import CustomerBillPay from './/customer/CustomerBillPay'
import CustomerTransfer from './/customer/CustomerTransfer'
import TellerMain from './/teller/TellerMain'
import TellerCustomerManage from './/teller/TellerCustomerManage'
import AdminMain from './/admin/AdminMain'
import AdminTellerManage from './/admin/AdminTellerManage'
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
      <Route exact path="/customer" element ={<CustomerMain/>}/>
      <Route exact path="/customer/paybill" element={<CustomerBillPay/>}/>
      <Route exact path="/customer/transfer" element={<CustomerTransfer/>}/>
      <Route exact path="/teller" element={<TellerMain/>}/>
      <Route exact path="/teller/managecustomer" element={<TellerCustomerManage/>}/>
      <Route exact path="/admin" element={<AdminMain/>}/>
      <Route exact path="/admin/manageteller" element={<AdminTellerManage/>}/>
      </Routes>
    </div>
  );
  
}


export default App;