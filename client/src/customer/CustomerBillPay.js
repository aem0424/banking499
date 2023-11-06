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
    const user = location.state.user;
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();    

    useEffect(() => {
        axios.get('/customer/accounts', {withCredentials:true})
        .then((response) => {
            if(response.status === 200) {
                setAccounts(response.data);
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

    const handleBackButton = () => {
        navigate('/Customer', {state: {user}})
    }

    return (
        <div className='container'>
            <h1>This is a placeholder for the customer bill payment screen.</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="PayTo">Pay To:</label>
                </div>
            </form>
            <label>
                Select Acount to Pay From
                <select>
                    <option value={formData.payto}>Pay To</option>
                </select>
                <form>
                    <div>
                        <label>Amount</label>
                    </div>
                </form>
            </label>
            <button type="submit">Pay Bill</button><br/>
            <button onClick={handleBackButton}>Back</button>
        </div>
    )
}
export default CustomerBillPay;