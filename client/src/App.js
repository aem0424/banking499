import React from "react"
import './App.css';
import ForgotPass from './/pre/ForgotPass'
import ConfirmForgotPass from './/pre/ConfirmForgotPass'
import Login from './/pre/Login'
import Register from './/pre/Register'
import ReactDemo from './ReactDemo'
import DataDisplay from './DataDisplay'
import CustomerBillPay from ".//customer/CustomerBillPay";
import CustomerDeposit from ".//customer/CustomerDeposit";
import CustomerEditUserInformation from ".//customer/CustomerEditUserInformation";
import CustomerMain from ".//customer/CustomerMain";
import CustomerTransaction from ".//customer/CustomerTransaction";
import CustomerTransfer from ".//customer/CustomerTransfer";
import CustomerWithdraw from ".//customer/CustomerWithdraw";
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
import TellerWithdraw from ".//teller/TellerWithdraw"
import TellerViewAccount from ".//teller/TellerViewAccount";
import TellerDeleteAccount from ".//teller/TellerDeleteAccount";
import TellerCustomerEdit from ".//teller/TellerCustomerEdit"
import AdminCreateTeller from ".//admin/AdminCreateTeller";
import AdminCustomerInfo from ".//admin/AdminCustomerInfo";
import AdminCustomerList from ".//admin/AdminCustomerList";
import AdminMain from ".//admin/AdminMain";
import AdminTellerEdit from ".//admin/AdminTellerEdit";
import AdminTellerDelete from ".//admin/AdminTellerDelete"
import AdminTellerList from ".//admin/AdminTellerList";
import AdminTellerMain from ".//admin/AdminTellerMain";
import TellerViewCustomerInfo from "./teller/TellerViewCustomerInfo";
import {Route, Routes} from 'react-router-dom';
import PrivateRouteAdmin from './/pre/PrivateRouteAdmin'
import PrivateRouteCustomer from './/pre/PrivateRouteCustomer'
import PrivateRouteTeller from './/pre/PrivateRouteTeller'




function App() {
  const [user, setUser] = React.useState(null);
  return (
   <div className="App" >
    <Routes>
      <Route exact path="/" element ={<Login/>}/>
      <Route exact path="/DataDisplay" element ={<DataDisplay/>}/>
      <Route exact path="/reactdemo" element ={<ReactDemo/>}/>
      <Route exact path="/ForgotPass" element ={<ForgotPass/>}/>
      <Route exact path="/ConfirmForgotPass" element ={<ConfirmForgotPass/>}/>
      <Route exact path="/Login" element ={<Login setUser={setUser}/>}/>
      <Route exact path="/Register" element ={<Register/>}/>
      <Route element = {<PrivateRouteCustomer />}>
        <Route exact path="/Customer" element ={<CustomerMain user={user}/>}/>
        <Route exact path="/Customer/Transaction" element ={<CustomerTransaction user={user}/>}/>
        <Route exact path="/Customer/Transaction/Transfer" element ={<CustomerTransfer user={user}/>}/>
        <Route exact path="/Customer/Transaction/Deposit" element ={<CustomerDeposit user={user}/>}/>
        <Route exact path="/Customer/Transaction/Withdraw" element = {<CustomerWithdraw user={user}/>}/>
        <Route exact path="/Customer/PayBill" element ={<CustomerBillPay user={user}/>}/>
        <Route exact path="/Customer/UserInfo" element ={<CustomerViewUserInformation user={user}/>}/>
        <Route exact path="/Customer/UserInfo/Edit" element ={<CustomerEditUserInformation user={user}/>}/>
        <Route exact path="/Customer/AccountInfo" element ={<CustomerViewAccountInformation user={user}/>}/>
        <Route exact path="/Customer/AccountList" element ={<CustomerViewAccountList user={user}/>}/>
      </Route>
      <Route element = {<PrivateRouteTeller />}>
        <Route exact path="/Teller" element = {<TellerMain user={user}/>}/>
        <Route exact path="/Teller/Account" element = {<TellerViewAccount user={user}/>}/>
        <Route exact path="/Teller/Account/Edit" element = {<TellerEditAccount user={user}/>}/>
        <Route exact path="/Teller/Transaction" element = {<TellerTransaction user={user}/>}/>
        <Route exact path="/Teller/Transaction/Deposit" element = {<TellerDeposit user={user}/>}/>
        <Route exact path="/Teller/Transaction/Transfer" element = {<TellerTransfer user={user}/>}/>
        <Route exact path="/Teller/Transaction/Withdraw" element = {<TellerWithdraw user={user}/>}/>
        <Route exact path="/Teller/Account/Create" element = {<TellerCreateAccount user={user}/>}/>
        <Route exact path="/Teller/Customer" element = {<TellerCustomerManage user={user}/>}/>
        <Route exact path="/Teller/Customer/UserInfo" element = {<TellerViewCustomerInfo user={user}/>}/>
        <Route exact path="/Teller/Customer/Edit" element = {<TellerCustomerEdit user={user}/>}/>
        <Route exact path="/Teller/Account/Delete" element = {<TellerDeleteAccount user={user}/>}/>
      </Route>
      <Route element = {<PrivateRouteAdmin />}>
        <Route exact path="/Admin" element = {<AdminMain user={user}/>}/>
        <Route exact path="/Admin/Teller" element = {<AdminTellerMain user={user}/>}/>
        <Route exact path="/Admin/Teller/CreateTeller" element = {<AdminCreateTeller user={user}/>}/>
        <Route path="/Admin/Teller/EditTeller/:id" element={<AdminTellerEdit user={user}/>} />
        <Route exact path="/Admin/Teller/Delete" element = {<AdminTellerDelete user={user}/>}/>
        <Route exact path="/Admin/Teller/TellerList" element = {<AdminTellerList user={user}/>}/>
        <Route exact path="/Admin/Customer" element = {<AdminCustomerList user={user}/>}/>
        <Route exact path="/Admin/Customer/Info" element = {<AdminCustomerInfo user={user}/>}/>
      </Route>
      <Route exact path="/" element ={<Login/>}/>
     </Routes>
    </div>
  );
  
}


export default App;