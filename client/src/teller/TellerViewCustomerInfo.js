import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'

function TellerViewCustomerInfo() {
    const location = useLocation();
    const navigate = useNavigate();    
    const user = location.state && location.state.user;
    const customer = location.state.customer;
    const [formData, setFormData] = useState({
        AccountName:'',
    });
    const [userData, setUserData] = useState(null);
    const [customerData, setCustomerData] = useState(null);
    const [customerAccounts, setCustomerAccounts] = useState(null);
    const [searchAccounts, setSearchAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchFound, setSearchFound] = useState(false);

      // Check if user is null, redirect to "/"
  useEffect(() => {
    if (!user) {
      navigate('/Login');
    }
  }, [user, navigate]);

    const handleBackButtonClick = () => {
        navigate('/Teller/Customer', {state: {user}})
    }

    const handleEditAccountClick = (account) => {
        navigate('/Teller/Account/Edit', {state: {user, customer, account}});
    }

    const handleCreateAccountClick = () => {
        navigate('/Teller/Account/Create', {state: {user, customer}});
    }

    const handleDeleteAccountClick = (account) => {
        navigate('/Teller/Account/Delete', {state: {user, customer, account}});
    }

    const handleTransactionClick = () => {
        navigate('/Teller/Transaction', {state: {user, customer}});
    }

    const handleViewAccountClick = (account) => {
        navigate('/Teller/Account', {state: {user, customer, account}});
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
            const response = await axios.get('/teller/customer/accounts/search', 
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
        if(user) {
            axios.get('/user', {})
            .then((response) => {
                if (response.status === 200) {
                    console.log("success")
                    setUserData(response.data);
                }
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
        }

        if (customer) {
            axios.get('/teller/customer/accounts', {
                params: {
                    UserID: customer.UserID
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    setCustomerAccounts(response.data);
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error('error', error);
                setError(error);
                setLoading(false);
            })
        }
    }, [user, customer]);

    return (
        <div className='container'>
            {loading ? (
                <p>Loading...</p>
            ): error ? (
                <p>ERROR: {error.message}</p>
            ) : searchFound ? (
                <div>
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
                  Name: {customer.FirstName} {customer.LastName}<br/>
                  Address: {customer.Street}, {customer.Street2}<br/>
                  Address: {customer.City}, {customer.State} {customer.ZIP}<br/>
                  Phone Number: {customer.PhoneNumber}<br/>
                  SSN: {customer.SSN}<br/>
                  Date of Birth: {customer.DOB}<br/>
                  <div>
              <h2>Customer Accounts</h2>
              <table className='striped-table'>
               <thead>
                <tr>
                  <th>Account Type</th>
                  <th>Account Name</th>
                  <th>Balance</th>
                  <th>Interest Rate</th>
                </tr>
                </thead>
            <tbody>
              {searchAccounts.map((account, index) => (
                <tr key={index}>
                  <td>{account.AccountType}</td>
                  <td>{account.AccountName}</td>
                  <td>{account.Balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                  <td>{account.InterestRate}</td>
                  <td><button onClick={() => handleEditAccountClick(account)}>Edit</button></td>
                </tr>
                ))}
              </tbody>
              </table>
             </div>                               
            </div>
            ): customer ? (
                <div>                      
                  Name: {customer.FirstName} {customer.LastName}<br/>
                  Address: {customer.Street}, {customer.Street2}<br/>
                  Address: {customer.City}, {customer.State} {customer.ZIP}<br/>
                  Phone Number: {customer.PhoneNumber}<br/>
                  SSN: {customer.SSN}<br/>
                  Date of Birth: {customer.DOB}<br/>
                  <div>
              <h2>Customer Accounts</h2>
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
              <table className='striped-table'>
               <thead>
                <tr>
                  <th>Account Type</th>
                  <th>Account Name</th>
                  <th>Balance</th>
                  <th>Interest Rate</th>
                </tr>
                </thead>
            <tbody>
              {customerAccounts.map((account, index) => (
                <tr key={index}>
                  <td>{account.AccountType}</td>
                  <td>{account.AccountName}</td>
                  <td>{account.Balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                  <td>{account.InterestRate}</td>
                  <td><button onClick={() => handleViewAccountClick(account)}>Transactions</button></td>
                  <td><button onClick={() => handleEditAccountClick(account)}>Edit</button></td>
                  <td><button onClick={() => handleDeleteAccountClick(account)}>Delete</button></td>
                </tr>
                ))}
              </tbody>
              </table>
             </div>     
             <button onClick={handleCreateAccountClick}>New Account</button>
             <button onClick={handleTransactionClick}>Make Transaction</button><br/>                                 
            </div>
            ) : null}
            <button onClick={handleBackButtonClick}>Back</button>            
        </div>
    )
}
export default TellerViewCustomerInfo;