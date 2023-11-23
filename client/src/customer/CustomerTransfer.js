import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom';
import './/css/CustomerTransfer.css';


function CustomerTransfer() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state && location.state.user;
    const [userAccounts, setUserAccounts] = useState([]);
    const [formData, setFormData] = useState({
        TransactionType:'Transfer',
        FromAccountID:'',
        ToAccountID:'',
        Amount:'',
    });
    const [loading, setLoading] = useState(true);    
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

      // Check if user is null, redirect to "/"
  useEffect(() => {
    if (!user) {
      navigate('/Login');
    }
  }, [user, navigate]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const createAccountList = (e) => {
        let accountList = [];
        userAccounts.map((account, index) => (
            accountList.push(<option key={index} value={account.AccountID}>{account.AccountName}, {account.AccountType}, {account.Balance.toLocaleString('en-US', { style: 'currency', currency: 'USD'})}</option>)
        ));
        return accountList;
    }

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

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const {TransactionType, FromAccountID, ToAccountID, Amount} = formData;
        setError(null);
        const handlingFrom = await axios.get('/customer/account', {params: {AccountID: FromAccountID}}, {withCredentials:true});
        const handlingTo = await axios.get('/customer/account', {params: {AccountID: ToAccountID}}, {withCredentials:true});
        const typeFrom = handlingFrom.data.AccountType;
        const typeTo = handlingTo.data.AccountType;
        const balanceFrom = handlingFrom.data.Balance;


        if(typeFrom === "Credit Card" ||  typeFrom === "Home Mortgage Loan") {
            setError("Can't transfer from " + typeFrom + " account.");
            setLoading(false);
        }
        else if(typeTo === "Credit Card" ||  typeTo === "Home Mortgage Loan") {
            setError("Can't transfer to " + typeTo + " account.");
            setLoading(false);            
        }
        else if(Amount <= 0) {
            setError("Can't transfer an amount less than or equal to $0.00.");
            setLoading(false);            
        }
        else if (balanceFrom - Amount < 0) {
            setError("Can't transfer if the account to transfer from would go negative.");
            setLoading(false);
        }
        else {
         try {
            const response = await axios.post('http://localhost:4000/transactions', formData);

        if(response.data) {
            console.log('success: ', response.data);
            setSuccess(true);
            setLoading(false);
         } else {
            setError(error);
            console.log('error: ', error)
            setLoading(false);
          }
         } catch (error) {
            setError('An unexpected error has occurred.')
            setLoading(false);
            console.log('error: ', error)
         }
        }
    };

    const handleBackButtonClick = () => {
        navigate('/Customer/Transaction', {state: {user}})
    }

    return (
        <div className='container'>
            {loading ? (
                <p>Loading...</p>
            ) : success ? (
                <p>Successful transfer!</p>
            ) : error ? (
                <p>ERROR: {error}</p>
            ) : userAccounts ? (
            <div>
                <h2>Transfer Funds</h2>
            <form onSubmit={handleSubmit} className='register-form'>
            <div className='form-group'> 
                <label htmlFor="FromAccountID" className='form-label'>Transfer From: </label>
                <select
                    type="text"
                    id="FromAccountID"
                    name="FromAccountID"
                    value={formData.FromAccountID}
                    onChange={handleInputChange}
                    required
                >
                    <option value="" disabled>Select an Account</option>
                    {createAccountList()};
                </select>                    
              </div>                     
              <div className='form-group'> 
                <label htmlFor="ToAccountID" className='form-label'>Transfer To: </label>
                <select
                    type="text"
                    id="ToAccountID"
                    name="ToAccountID"
                    value={formData.ToAccountID}
                    onChange={handleInputChange}
                    required
                >
                    <option value="" disabled>Select an Account</option>
                    {createAccountList()};
                </select>                    
              </div>          
              <div className='form-group'> 
                <label htmlFor="Amount" className='form-label'>Amount to Transfer</label>
                <input
                    type="numeric"
                    id="Amount"
                    name="Amount"
                    value={formData.Amount}
                    onChange={handleInputChange}
                    required
                />  
              </div> 
              <div>                         
                <button type="submit" className='submit-button'>Transfer Funds</button>
              </div>
            </form> 
            </div>               
            ) : null}
            <button onClick={handleBackButtonClick} className='form-button'>Back</button>            
        </div>
    )
}
export default CustomerTransfer;