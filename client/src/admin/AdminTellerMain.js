import React from 'react'

function AdminTellerMain() {
    return (
        <div>
            <a href="/Admin/Teller/CreateTeller">
                <button>Create Teller</button>
            </a>
            <a href="/Admin/Teller/TellerList">
                <button>Manage Tellers</button>
            </a>
        </div>
    )
}
export default AdminTellerMain;