import React from 'react'

function Home(){
    return(
        <div>
            <h1> Welcome to the Bank</h1>
            <ul>
                <li><Link to="/Register">Register for an account.</Link></li>
                <li><Link to="/Login">Login to your account.</Link></li>
                <li><Link to="/ForgotPass">Forgot your password?</Link></li>
            </ul>
        </div>
    )
}

export default Home;

