import React from 'react';
function Register(){
    return(

        <div className='container'>

            <h1> Register for an account.</h1>
            <label>Username</label>
            <input type='text' />
            <br />
            <label>Password</label>
            <input type='text' />
            <br />
            <button> Register </button>

        <div className="form-links">
            <a href="/Login">Login</a>
            <br />
            <a href="/ForgotPass">Forgot Password</a>
        </div>

    )
}


export default Register;
