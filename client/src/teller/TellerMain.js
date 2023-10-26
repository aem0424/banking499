import React from 'react'

function TellerMain() {
    return (
        <div>
            <h1>This is a placeholder for the main teller page.</h1>
            <button href = "/Teller/Transaction">Show Transactions</button>
            <button href = "/Teller/Customer">Search Customers</button>
            <button href = "/Teller/CreateAccount">Customer Account Requests</button>
        </div>
    )
}
export default TellerMain;