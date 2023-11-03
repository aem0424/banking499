import React from 'react'
import './/css/TellerMain.css';


function TellerMain() {
    return (
        <div>
            <h1>This is a placeholder for the main teller page.</h1>
            <a href = "/Teller/Transaction">
                <button>Show Transactions</button>
            </a>
            <a href = "Teller/Customer">
                <button>Search Customers</button>
            </a>
            <a href = "Teller/CreateAccount">
                <button>Customer Account Requests</button>
            </a>
            <button>Logout logic to-do</button>
        </div>
    )
}
export default TellerMain;