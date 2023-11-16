import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './/css/CustomerViewAccountList.css';

function CustomerViewAccountList() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state.user;
    const [formData, setFormData] = useState({
        AccountName: '',
    });
    const [userAccounts, setUserAccounts] = useState([]);
    const [searchAccounts, setSearchAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchFound, setSearchFound] = useState(false);

    const handleBackButtonClick = () => {
        navigate('/Customer', {state: {user}});
    }

    const handleViewInformationClick = (account) => {
        navigate('/Customer/AccountInfo', {state: {user, account}})
    }       

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        formData.AccountName = formData.AccountName.replace(/\s/g,"&");
        console.log(formData);
        try {
            const response = await axios.get('/customer/accounts/search', 
            {params: {AccountName: formData.AccountName}});
        if(response.data) {
            console.log('success:', response.data);
            setSearchAccounts(response.data);
            setSearchFound(true);
        }
        else {
            console.log('error!', error)
            setError(error);
        }
    } catch (error) {
        setError(error);
        console.log('error', error);
    }
    };

    useEffect(() => {
        axios.get('/customer/accounts', {withCredentials:true})
        .then((response) => {
            if (response.status === 200) {
                setUserAccounts(response.data);
            }
            setLoading(false);            
        })
        .catch((error) => {
            console.error("error occurred:", error);
            setError(error);
            setLoading(false);
        });
    }, [user]);

    return (
        <div className='container'>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>ERROR: {error.message}</p>
            ) : searchFound ? (
                <div>
                    <ul>
                        {searchAccounts.map((account, index) => (
                            <li key={index}>
                                <button onClick={() => handleViewInformationClick(account)}>{account.AccountName}</button><br/>
                                </li>
                            
                         ))}
                    </ul>
                </div>
            ) : userAccounts ? (
                <div>
                    <ul>
                        {userAccounts.map((account, index) => (
                            <li key={index}>
                                <button onClick={() => handleViewInformationClick(account)}>{account.AccountName}</button><br/>
                                </li>
                            
                         ))}
                    </ul>
                    <form onSubmit={handleSubmit} className='search-form'>
                        <div>
                            <label htmlFor="AccountName">Search Account by Name</label>
                            <input
                                type="text"
                                id="AccountName"
                                name="AccountName"
                                value={formData.AccountName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <button type="submit">Search</button>
                        </div>
                    </form>
                </div>
            ) : null}
            <button onClick={handleBackButtonClick}>Back</button>            
        </div>
    )
}
export default CustomerViewAccountList;