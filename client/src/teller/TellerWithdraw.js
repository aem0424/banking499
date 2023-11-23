import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerDeposit.css';

function TellerWithdraw() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state && location.state.user; 
    const customer = location.state.customer;
    const [customerAccounts, setCustomerAccounts] = useState([]);
    const [formData, setFormData] = useState({
        TransactionType:'Withdraw',
        FromAccountID:'',
        ToAccountID:'19',
        Amount:'',
    })
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!user) {
          navigate('/Login');
        }
      }, [user, navigate]);
    
    const handleBackButtonClick = () => {
        navigate('/Teller/Transaction', {state: {user, customer}})
    }

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
            console.log(response);
            if (response.status === 200) {
                setCustomerAccounts(response.data);
                console.log(customer);
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

        const handling = await axios.get('/teller/customer/account', {params: {UserID: customer.UserID, AccountID: FromAccountID}});
        console.log(handling);
        const type = handling.data.AccountType;
        const balanceFrom = handling.data.Balance;
        if(type === "Home Mortgage Loan") {
            setError("Can't withdraw from " + type + " account.");
            setLoading(false);
        }
        else if (isNaN(Number(Amount))) {
            setError("Can't enter an amount that isn't a number.");
            setLoading(false);
        }     
        else if (balanceFrom - Amount < 0) {
            setError("Can't withdraw if the account to withdraw from would go negative.");
            setLoading(false);
        }        
        else if(Amount <= 0) {
            setError("Can't withdraw an amount less than or equal to $0.00.");
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
            console.log('error!', error);
            setError(error);
            setLoading(false);
         }
         } catch (error) {
            setError('An unexpected error has occurred.');
            console.log('error: ', error)
            setLoading(false);
        }
      }
    };    

    return (
        <div className='container'>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>ERROR: {error}</p>
            ) : success ? (
                <p>Successful withdraw!</p>
            ) : customerAccounts ? (
            <div>
                <h1>Withdraw Funds</h1>             
            <form onSubmit={handleSubmit} className='amount-form'>
              <div> 
                <label htmlFor="FromAccountID" className='form-label'>Account:</label>
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
                <label htmlFor="Amount" className='form-label'>Amount to Withdraw:</label>
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
                <button type="submit" className='submit-button'>Withdraw Funds</button>
              </div>
            </form> 
            </div>               
            ) : null}
            <button onClick={handleBackButtonClick} className='form-button'>Back</button>            
        </div>
    )
}
export default TellerWithdraw;