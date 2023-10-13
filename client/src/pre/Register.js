import React from 'react';
function Register(){
    return(
        <div className='registration'>
            <h1> Register for an account.</h1>
            <label>Username</label>
            <input type='text' />
            <br />
            <label>Password</label>
            <input type='text' />
            <br />
            <button> Register </button>
        </div>
    )
}


export default Register;