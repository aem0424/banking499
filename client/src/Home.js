import React from 'react'
import { Link } from 'react-router-dom';

function Home(){
    return(
        <div>
            <h1> Welcome to the Bank</h1>
            <ul>
                <Link to="/Register">Register for an account.</Link>
                <br />
                <Link to="/Login">Login to your account.</Link>
                <br />
                <Link to="/ForgotPass">Forgot your password?</Link>
                <br />
            </ul>
        </div>
    )
}

export default Home;

