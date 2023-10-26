function CustomerMain() {
    return (
        <div className='container'>
            <h1>Welcome!</h1>
            <a href="/Customer/PayBill">
                <button>Pay Bill</button><br/>
            </a>
            <a href="/Customer/UserInfo">
                <button>User Information</button><br/>
            </a>
            <button html="/Customer/Transaction">Transfer/Deposit</button>
        </div>
    )
}
export default CustomerMain;