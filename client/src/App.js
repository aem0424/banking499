import React from "react"
import './App.css';
import ForgotPass from './/pre/ForgotPass'
import Login from './/pre/Login'
import Register from './/pre/Register'
import ReactDemo from './ReactDemo'
import DataDisplay from './DataDisplay'
import CustomerBillPay from ".//customer/CustomerBillPay";
import CustomerCreateAccount from ".//customer/CustomerCreateAccount";
import CustomerDeposit from ".//customer/CustomerDeposit";
import CustomerEditUserInformation from ".//customer/CustomerEditUserInformation";
import CustomerMain from ".//customer/CustomerMain";
import CustomerTransaction from ".//customer/CustomerTransaction";
import CustomerTransfer from ".//customer/CustomerTransfer";
import CustomerViewAccountInformation from ".//customer/CustomerViewAccountInformation";
import CustomerViewAccountList from ".//customer/CustomerViewAccountList";
import CustomerViewUserInformation from ".//customer/CustomerViewUserInformation";
import TellerCreateAccount from ".//teller/TellerCreateAccount";
import TellerCustomerManage from ".//teller/TellerCustomerManage";
import TellerDeposit from ".//teller/TellerDeposit";
import TellerEditAccount from ".//teller/TellerEditAccount";
import TellerMain from ".//teller/TellerMain";
import TellerTransaction from ".//teller/TellerTransaction";
import TellerTransfer from ".//teller/TellerTransfer";
import TellerViewAccount from ".//teller/TellerViewAccount";
import AdminCreateTeller from ".//admin/AdminCreateTeller";
import AdminCustomerAccountInfo from ".//admin/AdminCustomerAccountInfo";
import AdminCustomerAccountList from ".//admin/AdminCustomerAccountList";
import AdminCustomerInfo from ".//admin/AdminCustomerInfo";
import AdminCustomerInfoEdit from ".//admin/AdminCustomerInfoEdit";
import AdminCustomerList from ".//admin/AdminCustomerList";
import AdminMain from ".//admin/AdminMain";
import AdminTellerEdit from ".//admin/AdminTellerEdit";
import AdminTellerList from ".//admin/AdminTellerList";
import AdminTellerMain from ".//admin/AdminTellerMain";
import UserList from ".//pre/UserList";
import {Route, Routes} from 'react-router-dom';


function App() {
  return (
   <div className="App" >
    <Routes>
      <Route exact path="/" element ={<Login/>}/>
      <Route exact path="/DataDisplay" element ={<DataDisplay/>}/>
      <Route exact path="/reactdemo" element ={<ReactDemo/>}/>
      <Route exact path="/ForgotPass" element ={<ForgotPass/>}/>
      <Route exact path="/Login" element ={<Login/>}/>
      <Route exact path="/Register" element ={<Register/>}/>
      <Route exact path="/Customer" element ={<CustomerMain/>}/>
      <Route exact path="/Customer/Transaction" element ={<CustomerTransaction/>}/>
      <Route exact path="/Customer/Transaction/Transfer" element ={<CustomerTransfer/>}/>
      <Route exact path="/Customer/Transaction/Deposit" element ={<CustomerDeposit/>}/>
      <Route exact path="/Customer/PayBill" element ={<CustomerBillPay/>}/>
      <Route exact path="/Customer/CreateAccount" element ={<CustomerCreateAccount/>}/>
      <Route exact path="/Customer/UserInfo" element ={<CustomerViewUserInformation/>}/>
      <Route exact path="/Customer/UserInfo/Edit" element ={<CustomerEditUserInformation/>}/>
      <Route exact path="/Customer/AccountInfo" element ={<CustomerViewAccountInformation/>}/>
      <Route exact path="/Customer/AccountList" element ={<CustomerViewAccountList/>}/>
      <Route exact path="/Teller" element = {<TellerMain/>}/>
      <Route exact path="/Teller/Account" element = {<TellerViewAccount/>}/>
      <Route exact path="/Teller/Account/Edit" element = {<TellerEditAccount/>}/>
      <Route exact path="/Teller/Transaction" element = {<TellerTransaction/>}/>
      <Route exact path="/Teller/Transaction/Deposit" element = {<TellerDeposit/>}/>
      <Route exact path="/Teller/Transaction/Transfer" element = {<TellerTransfer/>}/>
      <Route exact path="/Teller/CreateAccount" element = {<TellerCreateAccount/>}/>
      <Route exact path="/Teller/Customer" element = {<TellerCustomerManage/>}/>
      <Route exact path="/Admin" element = {<AdminMain/>}/>
      <Route exact path="/Admin/Teller" element = {<AdminTellerMain/>}/>
      <Route exact path="/Admin/Teller/CreateTeller" element = {<AdminCreateTeller/>}/>
      <Route path="/Admin/Teller/EditTeller/:id" element={<AdminTellerEdit />} />
      <Route exact path="/Admin/Teller/TellerList" element = {<AdminTellerList/>}/>
      <Route exact path="/Admin/Customer" element = {<AdminCustomerList/>}/>
      <Route exact path="/Admin/Customer/Account" element = {<AdminCustomerAccountList/>}/>
      <Route exact path="/Admin/Customer/Account/Info" element = {<AdminCustomerAccountInfo/>}/>
      <Route exact path="/Admin/Customer/Info" element = {<AdminCustomerInfo/>}/>
      <Route exact path="/Admin/Customer/Info/Edit" element = {<AdminCustomerInfoEdit/>}/>
      <Route exact path="/UserList" element = {<UserList/>}/>
     </Routes>
    </div>
  );
  
}


export default App;