// NOTE: this entire file is experimental for a possible method in which we can ensure that we get the right link when typing
// in redirects; it is currently a WIP and i will want to test this further to make sure everything works OK
function Url() {
    const H_HOME ="/";
    const H_REGISTER = "/register"
    const H_LOGIN = "/login";
    const H_FORGOT = "/forgotpass"
    const C_MAIN ="/customer";
    const C_BILLPAY = "/customer/paybill";
    const C_ACCOUNT = "/customer/account";
    const C_VIEW = "/customer/account/view";
    const C_CREATE = "/customer/account/create";
    const C_INFO = "/customer/user";
    const C_EDIT = "/customer/user/edit";
    const C_TRANSACTION = "/customer/transaction";
    const C_TRANSFER = "/customer/transaction/transfer";
    const C_DEPOSIT = "/customer/transaction/deposit";
    const T_MAIN = "/teller";
    const T_C_MAIN = "/teller/customer";
    const T_C_CREATE = "/teller/customer/create";
    const T_C_VIEW = "teller/customer/view";
    const T_C_EDIT = "teller/customer/edit";
    const T_TRANSACTION = "/teller/transaction";
    const T_TRANSFER = "/teller/transaction/transfer";
    const T_DEPOSIT = "/teller/transaction/deposit";
    const A_MAIN = "/admin";
    const A_C_MAIN = "/admin/customer";
    const A_T_MAIN = "/admin/teller";

}
export default Url;

/*
    remaining to-do links go here
*/