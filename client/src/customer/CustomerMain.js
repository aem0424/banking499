import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './/css/CustomerMain.css';

function CustomerMain() {
    const [user, setUser] = useState({
        FirstName: '',
    });

    useEffect(() => {
        axios.get('users/customer').then((response) => {
            if(response.status === 200) {
                setUser(response.data);
            }
        }).catch((error) => {
            console.log("error", error);
        });
    }, [user])

    return (
        <div className='container'>
            <h1>Welcome, {user.FirstName}!</h1>
            <a href="/Customer/PayBill">
                <button>Pay Bill</button><br/>
            </a>
            <a href="/Customer/UserInfo">
                <button>User Information</button><br/>
            </a>
            <a href="/Customer/Transaction">
                <button>Transfer/Deposit</button>
            </a>
        </div>
    )
}
export default CustomerMain;