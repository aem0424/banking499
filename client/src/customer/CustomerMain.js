import React, { useState } from 'react';
import axios from 'axios';

function CustomerMain() {
    return (
        <div className='container'>
            <h1>This is a placeholder for the main customer page; when finished, it will show all their bank accounts.</h1>
            <a href="/customer/paybill">
                <button>Pay Bill</button>
            </a>
            <a href="/customer/settings">
                <button>Account Settings</button>
            </a>
            <a href="/customer/transaction">
                <button>Transfer/Deposit</button>
            </a>
        </div>
    )
}
export default CustomerMain;