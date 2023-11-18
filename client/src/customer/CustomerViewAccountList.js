import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './/css/CustomerViewAccountList.css';

function CustomerViewAccountList() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state && location.state.user;
    const [formData, setFormData] = useState({
        AccountName: '',
    });
    const [userAccounts, setUserAccounts] = useState([]);
    const [searchAccounts, setSearchAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchFound, setSearchFound] = useState(false);

    useEffect(() => {
        if (!user) {
          navigate('/Login');
        }
      }, [user, navigate]);

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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
  
    const handleLoadMore = () => {
      setCurrentPage(currentPage + 1);
    };
  
    const handleLoadPrevious = () => {
      setCurrentPage(currentPage - 1);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;

    return (
        <div className='container'>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>ERROR: {error.message}</p>
            ) : (
                <div>
                    <h2>Account Type</h2>
                    {searchFound ? (
                <div>
                    {searchAccounts.length > 0 ?(
                        <table className='striped-table'>
                        <thead>
                            <tr>
                            <th>Account Type</th>
                            <th>Account Name</th>
                            <th>Balance</th>
                            <th></th>
                            </tr>
                        </thead>
                    <tbody>
                        {searchAccounts
                            .sort((a, b) => a.AccountType.localeCompare(b.AccountType))
                            .slice(startIndex,endIndex)
                            .map((account, index) => (
                            <tr key={index}>
                                <td>{account.AccountType}</td>
                                <td>{account.AccountName}</td>
                                <td>{account.Balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                <td>
                                    <button onClick={() => handleViewInformationClick(account)}>View</button><br/>
                                </td>
                            </tr>
                         ))}
                    </tbody>
                    </table>
                    ) : (
                        <p style={{color:'red'}}>No Accounts Found</p>
                    )}
                </div>
            ) : (
                <div>
                    {userAccounts.length > 0 ? (
                    <table className='striped-table'>
                        <thead>
                            <tr>
                            <th>Account Type</th>
                            <th>Account Name</th>
                            <th>Balance</th>
                            <th></th>
                            </tr>
                        </thead>
                    <tbody>
                        {userAccounts
                            .sort((a, b) => a.AccountType.localeCompare(b.AccountType))
                            .slice(startIndex,endIndex)
                            .map((account, index) => (
                            <tr key={index}>
                                <td>{account.AccountType}</td>
                                <td>{account.AccountName}</td>
                                <td>{account.Balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                <td>
                                    <button onClick={() => handleViewInformationClick(account)}>View</button><br/>
                                </td>
                            </tr>
                            
                         ))}
                    </tbody>
                    </table>
                    ) : (
                        <p style={{ color: 'red' }}>No Active Accounts</p>
                    )}
                    {startIndex > 0 && (
                        <button onClick={handleLoadPrevious} className='form-button'>Load Previous Accounts</button>
                    )}
                    {endIndex < userAccounts.length && (
                        <button onClick={handleLoadMore} className='form-button'>Load More Accounts</button>
                    )}
                    <form onSubmit={handleSubmit} className='search-form'>
                        <div>
                            <label htmlFor="AccountName" className='form-label'>Search Account by Name</label>
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
                            <button type="submit" className='submit-button'>Search</button>
                        </div>
                    </form>
                </div>
            )}
            <button onClick={handleBackButtonClick} className='form-button'>Back</button>            
            </div>
            )}
        </div>
    );
}
export default CustomerViewAccountList;