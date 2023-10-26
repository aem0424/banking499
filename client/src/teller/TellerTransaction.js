import React from 'react'

function TellerTransaction() {
    return (
        <div>
            <h1>Please select a transaction to perform on the selected account.</h1>
            <button html = "Teller/Transaction/Transfer">Transfer</button>
            <button html = "Teller/Transaction/Deposit">Deposit</button>
        </div>
    )
}
export default TellerTransaction;