import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerTransfer.css';


function TellerTransfer() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state && location.state.user;
    const customer = location.state.customer;
    const [customerAccounts, setCustomerAccounts] = useState([]);
    const [formData, setFormData] = useState({
        TransactionType:'Transfer',
        FromAccountID:'',
        ToAccountID:'',
        Amount:'',
    });
    const [loading, setLoading] = useState(true);    
    const [error, setError] = useState(null);     
    const [success, setSuccess] = useState(false);    
    
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
        customerAccounts.map((account, index) => (
            accountList.push(<option key={index} value={account.AccountID}>{account.AccountName}, {account.AccountType}, {account.Balance.toLocaleString('en-US', { style: 'currency', currency: 'USD'})}</option>)
        ));
        return accountList;
    }

    useEffect(() => {
        axios.get('/teller/customer/accounts', {params: {UserID: customer.UserID}})
        .then((response) => {
            if (response.status === 200) {
                setCustomerAccounts(response.data);
            }
            setLoading(false);            
        })
        .catch((error) => {
            console.error("error occurred:", error);
            setError(error);
            setLoading(false);
        });
    }, [customer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {TransactionType, FromAccountID, ToAccountID, Amount} = formData;
        setError(null);
        const handlingFrom = await axios.get('/teller/customer/account', {params: {UserID: customer.UserID, AccountID: FromAccountID}}, {withCredentials:true});
        const handlingTo = await axios.get('/teller/customer/account', {params: {UserID: customer.UserID, AccountID: ToAccountID}}, {withCredentials:true});
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
        else if (isNaN(Number(Amount))) {
            setError("Can't enter an amount that isn't a number.");
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
            const response = await axios.post('http://localhost:4000/transactions', {
                TransactionType,
                FromAccountID,
                ToAccountID,
                Amount
            });

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
        navigate('/Teller/Transaction', {state: {user, customer}})
    }

    return (
        <div className='container'>
            {loading ? (
                <p>Loading...</p>
            ) : success ? (
                <p>Successfully transferred!</p>
            ) : error ? (
                <p>ERROR: {error}</p>
            ) : customerAccounts ? (
            <div>
                <h1>Transfer Funds</h1>             
            <form onSubmit={handleSubmit} className='amount-form'>
            <div> 
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
              <div> 
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
              <div> 
                <label htmlFor="Amount" className='form-label'>Amount to Transfer: </label>
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
export default TellerTransfer;