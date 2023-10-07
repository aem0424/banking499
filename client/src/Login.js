import React from 'react'

function Login(){
    return(
        <div className='login'>
            <h1> Login to your account.</h1>
            <input type='text' placeholder = "Username"/>
            <br />
            <input type='password' placeholder='Password'/>
            <br />
            <button> Login </button>
        </div>
    )
}

export default Login;
