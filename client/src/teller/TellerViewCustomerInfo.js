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

    const handle1099Click = (account) => {
        const get1099Data = async() => {
          const response = await axios.get('/1099form', {params: {AccountID: account.AccountID}, responseType:'blob'})
          if(response) {
            const pdfUrl = URL.createObjectURL(new Blob([response.data]));
            window.open(pdfUrl, '_blank');
          }
        }
        get1099Data();
    }

    const handleEditCredentialsClick = () => {
        navigate('/Teller/Customer/Edit', {state: {user, customer}});
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
            {params: {AccountName: formData.AccountName, UserID: customer.UserID}});
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
                <h2>Customer Information</h2>
                <div className='info'>
            <p><strong>Name:</strong> {customer.FirstName} {customer.LastName}<strong> Home Phone Number:</strong> {customer.PhoneNumber} <strong>Cell Phone Number:</strong> {customer.CellPhoneNumber} <strong> SSN:</strong> {customer.SSN} <strong> Date of Birth:</strong> {customer.DOB}</p>
            <p><strong>Address Line 1:</strong> {customer.Street} <strong>Address Line 2:</strong> {customer.Street2} <strong>City/State/ZIP:</strong> {customer.City}, {customer.State}, {customer.ZIP}</p>
            </div>
            <h2>Account List</h2>
                  {searchFound ? (
            <div>
              {searchAccounts.length > 0 ?(
                <table className='striped-table'>
                      <thead>
                        <tr>
                          <th>Account Type</th>
                          <th>Account Name</th>
                          <th>Balance</th>
                          <th>Interest Rate</th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                  <tbody>
                    {searchAccounts
                    .sort((a,b) => a.AccountType.localeCompare(b.AccountType))
                    .slice(startIndex,endIndex)
                    .map((account, index) => (
                        <tr key={index}>
                        <td>{account.AccountType}</td>
                        <td>{account.AccountName}</td>
                        <td>{account.Balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        <td>{account.InterestRate}</td>
                        <td>
                          <button onClick={() => handleViewAccountClick(account)}>View</button>
                        </td>
                        <td>
                          <button onClick={() => handleEditAccountClick(account)}>Edit</button>
                        </td>
                        <td>
                          <button onClick={() => handleDeleteAccountClick(account)}>Delete</button>
                        </td>
                        <td>
                              <button onClick={() => handle1099Click(account)}>1099</button>
                            </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ):(
                <p style={{color:'red'}}>No Accounts Found</p>
              )}          
          </div>
            ) : (
              <div>
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
                  {customerAccounts.length> 0 ? (
                    <table className='striped-table'>
                      <thead>
                        <tr>
                          <th>Account Type</th>
                          <th>Account Name</th>
                          <th>Balance</th>
                          <th>Interest Rate</th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerAccounts.sort((a,b) => a.AccountType.localeCompare(b.AccountType)).slice(startIndex,endIndex).map((account,index) => (
                          <tr key={index}>
                            <td>{account.AccountType}</td>
                            <td>{account.AccountName}</td>
                            <td>{account.Balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                            <td>{account.InterestRate}</td>
                            <td>
                              <button onClick={() => handleViewAccountClick(account)}>View</button>
                            </td>
                            <td>
                              <button onClick={() => handleEditAccountClick(account)}>Edit</button>
                            </td>
                            <td>
                              <button onClick={() => handleDeleteAccountClick(account)}>Delete</button>
                            </td>
                            <td>
                              <button onClick={() => handle1099Click(account)}>1099</button>
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
                        {endIndex < customerAccounts.length && (
                          <button onClick={handleLoadMore} className='form-button'>Load More Accounts</button>
                        )}
                        <button onClick={handleCreateAccountClick} className='form-button'>New Account</button>
                        <button onClick={handleTransactionClick} className='form-button'>Make Transaction</button>
                        <button onClick={handleEditCredentialsClick} className='form-button'>Edit Credentials</button>
                </div> 
            )}                       
            <button onClick={handleBackButtonClick} className='form-button'>Back</button>
        </div>
            )}
            </div>
    );
}
export default TellerViewCustomerInfo;