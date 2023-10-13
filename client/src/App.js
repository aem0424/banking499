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
import CustomerViewAccountList from ".//customer/CustomerViewAccountList";
import CustomerViewAccountInformation from ".//customer/CustomerViewAccountInformation";
import CustomerCreateAccount from ".//customer/CustomerCreateAccount";
import CustomerViewUserInformation from ".//customer/CustomerViewUserInformation";
import CustomerTransaction from ".//customer/CustomerTransaction";
import CustomerDeposit from ".//customer/CustomerDeposit";
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
      <Route exact path="/customer/account" element={<CustomerViewAccountList/>}/>
      <Route exact path="/customer/account/view" element={<CustomerViewAccountInformation/>}/>
      <Route exact path="/customer/account/create" element={<CustomerCreateAccount/>}/>
      <Route exact path="/customer/user" element={<CustomerViewUserInformation/>}/>
      <Route exact path="/customer/transaction" element={<CustomerTransaction/>}/>
      <Route exact path="/customer/transaction/transfer" element={<CustomerTransfer/>}/>
      <Route exact path="/customer/transaction/deposit" element={<CustomerDeposit/>}/>
      <Route exact path="/teller" element={<TellerMain/>}/>
      <Route exact path="/teller/customer" element={<TellerCustomerManage/>}/>
      <Route exact path="/admin" element={<AdminMain/>}/>
      <Route exact path="/admin/teller" element={<AdminTellerManage/>}/>
      </Routes>
    </div>
  );
  
}


export default App;