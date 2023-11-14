import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/CustomerBillPay.css';


function CustomerBillPay() {
    const [formData, setFormData] = useState({
        Name:'',
        Address:'',
        Amount:'',
        PayFromAccount:'',
        DueDate:'',
    });
    const location = useLocation();
    const navigate = useNavigate();        
    const user = location.state.user;
    const [userAccounts, setUserAccounts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const [success, setSuccess] = useState(false);
    
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
        try {
            console.log(formData);
            const response = await axios.post('/billpay/account', formData, {withCredentials: true});
            if (response.status === 201) {
                console.log('success', response.data);
                setSuccess(true);
            } else {
                console.error('error', response.status);
            }
        } catch (error) {
            console.error('ERROR', error);
        }
    };

    return (
        <div className='container'>
        {loading ? (
            <p>Loading...</p>
        ) : error ? (
            <p>ERROR: {error.message}</p>
        ) : success ? (
            <p>Success!</p>
        ) : userAccounts ? (
        <div>
            <h1>Pay Bill</h1>             
        <form onSubmit={handleSubmit} className='amount-form'>
        <div> 
            <label htmlFor="Name">Payee Name:</label>
            <input
                type="text"
                id="Name"
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
                required
            />  
          </div>         
          <div> 
            <label htmlFor="Address">Payee Address:</label>
            <input
                type="text"
                id="Address"
                name="Address"
                value={formData.Address}
                onChange={handleInputChange}
                required
            />  
          </div>                          
        <div> 
            <label htmlFor="PayFromAccount">Pay From:</label>
            <select
                type="text"
                id="PayFromAccount"
                name="PayFromAccount"
                value={formData.PayFromAccount}
                onChange={handleInputChange}
                required
            >
                <option value="" disabled>Select an Account</option>
                {createAccountList()};
            </select>                    
          </div>                            
          <div> 
            <label htmlFor="Amount">Amount to Transfer:</label>
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
            <label htmlFor="DueDate">Due Date:</label>
            <input
                type="date"
                id="DueDate"
                name="DueDate"
                value={formData.DueDate}
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