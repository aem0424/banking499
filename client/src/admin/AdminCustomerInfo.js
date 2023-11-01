import React from 'react'

function AdminCustomerInfo() {
    return (
        <div className='container'>
            <p>Name:</p>
            <p>Address:</p>
            <p>Phone Number:</p>
            <p>SSN:</p>
            <p>Date of Birth:</p>
            <a href="Admin/Customer/Info/Edit">             
                <button>Edit Customer Info</button>
            </a>   
        </div>
    )
}
export default AdminCustomerInfo;