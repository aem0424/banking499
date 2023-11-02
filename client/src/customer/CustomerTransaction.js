import React from 'react'
import axios from 'axios'

function CustomerTransaction() {
    return (
        <div>
            <h1>Please select a transaction to perform.</h1>
            <a href="/Customer/Transaction/Transfer">
                <button>Transfer</button>
            </a>
            <a href="/Customer/Transaction/Deposit">
                <button>Deposit</button>
            </a>
        </div>
    )
}
export default CustomerTransaction;