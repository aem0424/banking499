import React from 'react'
import axios from 'axios'

function CustomerTransaction() {
    return (
        <div>
            <h1>Please select a transaction to perform.</h1>
            <button url="/Customer/Transaction/Transfer">Transfer</button>
            <button url="/Customer/Transaction/Deposit">Deposit</button>
        </div>
    )
}
export default CustomerTransaction;