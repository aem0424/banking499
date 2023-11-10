import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom';
import './/css/CustomerDeposit.css';


function CustomerDeposit() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state.user;
    const [userAccounts, setUserAccounts] = useState([]);
    const [formData, setFormData] = useState({
        TransactionType:'Deposit',
        FromAccountID:'',
        Amount:'',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const createAccountList = (e) => {
        let accountList = [];
        for(let i = 0; i < userAccounts.size; i++) {
            console.log("test");
            accountList.push(<option key={i} value={i}>{i}</option>)
        }
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
            console.log('error!');
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
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>ERROR: {error.message}</p>
            ) : userAccounts ? (
            <div>
                <h1>This is a placeholder for the customer deposit screen. I may try to implement a dropdown that 
                shows all of a customer's accounts instead of requiring them to type it out.</h1>             
            <form onSubmit={handleSubmit} className='amount-form'>
              <div> 
                <label htmlFor="FromAccountID">Account</label>
                <select
                    type="text"
                    id="FromAccountID"
                    name="FromAccountID"
                    value={formData.FromAccountID}
                    onChange={handleInputChange}
                    required
                >
                    {createAccountList()};
                </select>                    
              </div>          
              <div> 
                <label htmlFor="Amount">Amount to Deposit</label>
                <input
                    type="text"
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
export default CustomerDeposit;