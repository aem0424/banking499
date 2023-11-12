import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/CustomerDeleteRequest.css';

function CustomerDeleteRequest() {
    const location = useLocation();
    const user = location.state.user;
    const account = location.state.account;
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [accountData, setAccountData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleNo = () => {
        navigate('/Customer/AccountInfo')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.delete('/customer/account/delete')
            if(response.status === 200) {
                console.log('Delete request submitted');
            } else {
                console.error("error: ", error);
            }
        } catch (error) {
            console.log("an error has occured", error)
        }
    }

    useEffect(() => {
        if (user) {
            axios.get('/user', {})
            .then((response) => {
                if (response.status === 200) {
                    setUserData(response.data);
                }
            }).catch((error) => {
                setError(error);
                setLoading(false);
            })
        }
        if (account) {
            axios.get('/customer/account', account, {withCredentials:true})
            .then((response) => {
                if(response.status === 200) {
                    setAccountData(response.data);
                    setLoading(false);
                }
            }).catch((error) => {
                setError(error);
                setLoading(false);
            })
        }
    }, [user, account]);

    return (
     <div className='container'>
        {loading ? (
            <p>Loading...</p>
        ) : error ? (
            <p>Error: {error.message}</p>
        ) : accountData ? (
            <div>
                <p>Are you sure you want to delete the account TBA?</p>
                <button onClick={handleSubmit}>Yes</button>
                <button onClick={handleNo}>No</button>
            </div>
        ): null}
     </div>
    )
}

export default CustomerDeleteRequest;