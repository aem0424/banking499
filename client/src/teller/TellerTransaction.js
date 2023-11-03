import React from 'react'
import './/css/TellerTransaction.css';


function TellerTransaction() {
    return (
        <div>
            <h1>Please select a transaction to perform on the selected account.</h1>
            <a href = "Teller/Transaction/Transfer">
                <button>Transfer</button>
            </a>
            <a href = "Teller/Transaction/Deposit">
                <button>Deposit</button>
            </a>            
        </div>
    )
}
export default TellerTransaction;