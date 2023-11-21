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
            accountList.push(<option key={index} value={account.AccountID}>{account.AccountID}: {account.AccountName}</option>)
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

        const handling = await axios.get('/teller/customer/account', {params: {UserID: customer.UserID, AccountID: ToAccountID}});
        const type = handling.data.AccountType;
        if(type === "Home Mortgage Loan") {
            setError("Can't withdraw from " + type + " account.");
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
         } else {
            console.log('error!', error);
         }
         } catch (error) {
            setError(error);
            console.log('error: ', error)
         }
        }
    };    

    return (
        <div className='container'>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>ERROR: {error.message}</p>
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