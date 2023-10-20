import React from 'react'

function AdminMain() {
    return (
        <div>
            <h1>This is a placeholder for the main admin page.</h1>
            <button>Show Transactions</button><br/>
            <a href="/Admin/Teller">
                <button>Manage Tellers</button>
            </a>
            <a href="/Admin/Customer">
                <button>Manage Customers</button>
            </a>
        </div>
    )
}
export default AdminMain;