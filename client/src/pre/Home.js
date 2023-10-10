import React from 'react'
//<<<<<<< HEAD
import { Link } from 'react-router-dom';
//=======
//>>>>>>> 5eb8fe5aa6669f0f0fac23609280ba73c82d2964

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

