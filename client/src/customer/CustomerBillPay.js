import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/CustomerBillPay.css';


function CustomerBillPay() {
    const [formData, setFormData] = useState({
        PayTo:'',
        PayAmount:'',
    });
    const location = useLocation();
    const navigate = useNavigate();        
    const user = location.state.user;
    const [userAccounts, setUserAccounts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    
    const createAccountList = (e) => {
        let accountList = [];
        userAccounts.map((account, index) => (
            accountList.push(<option key={index} value={account.AccountID}>{account.AccountID}: {account.AccountName}</option>)
        ));
        return accountList;
    }    
        
    const handleBackButtonClick = () => {
        navigate('/Customer', {state: {user}})
    }    

    useEffect(() => {
        axios.get('/customer/accounts', {withCredentials:true})
        .then((response) => {
            if(response.status === 200) {
                setUserAccounts(response.data);
            }
        }).catch((error) => {
            console.error('ERROR: ', error);
        });
    }, [])

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
    };

    return (
        <div>
        {loading ? (
            <p>Loading...</p>
        ) : error ? (
            <p>ERROR: {error.message}</p>
        ) : userAccounts ? (
        <div>
            <h1>Transfer Funds</h1>             
        <form onSubmit={handleSubmit} className='amount-form'>
        <div> 
            <label htmlFor="FromAccountID">Transfer From: </label>
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
            <label htmlFor="Amount">Amount to Transfer</label>
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
            <button type="submit">Pay Bill</button>
          </div>
        </form> 
        </div>               
        ) : null}
        <button onClick={handleBackButtonClick}>Back</button>            
    </div>
)
}
export default CustomerBillPay;