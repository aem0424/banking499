import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerDeposit.css';

function TellerDeposit() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state.user;   
    const customer = location.state.customer;
    const [customerAccounts, setCustomerAccounts] = useState([]);
    const [formData, setFormData] = useState({
        TransactionType:'Deposit',
        FromAccountID:'19',
        ToAccountID:'',
        Amount:'',
    })
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    const handleBackButtonClick = () => {
        navigate('/Teller/Transaction', {state: {user}})
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
        axios.get('/teller/customer/accounts', {UserID: customer.UserID, withCredentials:true})
        .then((response) => {
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
        const {TransactionType, FromAccountID, Amount} = formData;
        const ToAccountID = FromAccountID;
        setError(null);

        console.log(TransactionType, FromAccountID, ToAccountID, Amount);
        try {
            const response = await axios.post('http://localhost:4000/transactions', {
                TransactionType,
                FromAccountID,
                ToAccountID,
                Amount
            });

        if(response.data) {
            console.log('success: ', response.data);
        } else {
            console.log('error!', error);
        }
        } catch (error) {
            setError(error);
            console.log('error: ', error)
        }
    };    

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>ERROR: {error.message}</p>
            ) : customerAccounts ? (
            <div>
                <h1>Deposit Funds</h1>             
            <form onSubmit={handleSubmit} className='amount-form'>
              <div> 
                <label htmlFor="ToAccountID">Account</label>
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
                <label htmlFor="Amount">Amount to Deposit</label>
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
                <button type="submit">Deposit Funds</button>
              </div>
            </form> 
            </div>               
            ) : null}
            <button onClick={handleBackButtonClick}>Back</button>            
        </div>
    )
}
export default TellerDeposit;