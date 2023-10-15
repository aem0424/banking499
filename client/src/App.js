/*
  NOTE:
  the routes part may be unecessary? it seems like axios does this for us
  if i notice this causing problems with rerouting, i will remove most of
  everything after the home path, but keep the axios stuff since that's
  what we plan on using
*/
import React from "react"
import './App.css';
import './Url.js'; // this is meant to be a constants file of sorts
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
import CustomerEditUserInformation from ".//customer/CustomerEditUserInformation";
import TellerMain from './/teller/TellerMain'
import TellerCustomerManage from './/teller/TellerCustomerManage'
import TellerCreateAccount from ".//teller/TellerCreateAccount";
import TellerDeposit from ".//teller/TellerDeposit";
import TellerTransaction from ".//teller/TellerTransaction";
import TellerTransfer from ".//teller/TellerTransfer";
import TellerViewAccount from ".//teller/TellerViewAccount";
import TellerEditAccount from ".//teller/TellerEditAccount";
import AdminMain from './/admin/AdminMain'
import AdminTellerList from '../admin/AdminTellerList'
import {Route, Routes} from 'react-router-dom';
//import Url from "./Url.js";


function App() {
  return (
   <div className="App" >
    <Routes>
      {/* <Route exact path={Constants.HOME} element ={<Home/>}/> <- this is experimental and a wip*/}
      <Route exact path="/" element={<Home/>}/>
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
      <Route exact path="/customer/user/edit" element={<CustomerEditUserInformation/>}/>
      <Route exact path="/teller" element={<TellerMain/>}/>
      <Route exact path="/teller/customer" element={<TellerCustomerManage/>}/>
      <Route exact path="/teller/customer/create" element={<TellerCreateAccount/>}/>
      <Route exact path="/teller/customer/view" element={<TellerViewAccount/>}/>
      <Route exact path="/teller/customer/edit" element={<TellerEditAccount/>}/>
      <Route exact path="/teller/transaction" element={<TellerTransaction/>}/>
      <Route exact path="/teller/transaction/transfer" element={<TellerTransfer/>}/>
      <Route exact path="/teller/transaction/deposit" element={<TellerDeposit/>}/>
      <Route exact path="/admin" element={<AdminMain/>}/>
      <Route exact path="/admin/teller" element={<AdminTellerList/>}/>
      <Route exact path="/admin/teller/create" element={<AdminCreateTeller/>}/>
      <Route exact path="/admin/customer/user" element={<AdminCustomerAccountInfo/>}/>
     </Routes>
    </div>
  );
  
}


export default App;