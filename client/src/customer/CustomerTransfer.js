import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom';
import './/css/CustomerTransfer.css';


function CustomerTransfer() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state.user;
    const [formData, setFormData] = useState({
        TransactionType:'Transfer',
        FromAccountID:'',
        ToAccountID:'',
        Amount:'',
    });
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

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
            }, { withCredentials: true});

        if(response.data) {
            console.log(response.data);
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
        <div className='container'>
            <form onSubmit={handleSubmit} className="amount-form">
                <div>
                    <label htmlFor="FromAccountID">Transfer From:</label>
                    <input
                     type="text"
                     id="FromAccountID"
                     name="FromAccountID"
                     value={formData.FromAccountID}
                     onChange={handleInputChange}
                     required
                    />
                </div> 
                <div>
                    <label htmlFor="ToAccountID">Transfer To:</label>
                    <input
                     type="text"
                     id="ToAccountID"
                     name="ToAccountID"
                     value={formData.ToAccountID}
                     onChange={handleInputChange}
                     required
                    />
                </div>                                            
                <div>
                    <label htmlFor="Amount">Amount to Transfer:</label>
                    <input
                     type="text"
                     id="Amount"
                     name="Amount"
                     value={formData.Amount}
                     onChange={handleInputChange}
                     required
                    />
                </div>
                <button type="submit">Transfer Funds</button>                
            </form>
            <button onClick={handleBackButtonClick}>Back</button>
        </div>
    )
}
export default CustomerTransfer;