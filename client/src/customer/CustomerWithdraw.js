import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/CustomerWithdraw.css';
function CustomerWithdraw() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state && location.state.user;
    const [userAccounts, setUserAccounts] = useState([]);
    const [formData, setFormData] = useState({
        TransactionType:'Withdraw',
        FromAccountID:'',
        ToAccountID:'19',
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
            accountList.push(<option key={index} value={account.AccountID}>{account.AccountID}: {account.AccountName}</option>)
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
        e.preventDefault();
        const {TransactionType, FromAccountID, ToAccountID, Amount} = formData;
        setError(null);
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
    };

    const handleBackButtonClick = () => {
        navigate('/Customer/Transaction', {state: {user}})
    }

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
                <h1>Withdraw Funds</h1>             
            <form onSubmit={handleSubmit} className='register-form'>
              <div className='form-group'> 
                <label htmlFor="FromAccountID" className='form-label'>Account</label>
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
                <label htmlFor="Amount" className='form-label'>Amount to Withdraw</label>
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
export default CustomerWithdraw;