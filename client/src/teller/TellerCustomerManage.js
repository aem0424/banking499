import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './/css/TellerCustomerManage.css';


function TellerCustomerManage() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state && location.state.user;
    const [formData, setFormData] = useState({
      Name: '',
    })
    const [customers, setCustomers] = useState([]);
    const [searchCustomers, setSearchCustomers] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchFound, setSearchFound] = useState(false);

      // Check if user is null, redirect to "/"
  useEffect(() => {
    if (!user) {
      navigate('/Login');
    }
  }, [user, navigate]);

    const handleBackButtonClick = () => {
        navigate('/Teller', {state: {user}})
    }

    const handleViewCustomerClick = (customer) => {
        navigate('/Teller/Customer/UserInfo', {state: {user, customer}})
    }

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
    formData.Name = formData.Name.replace(/\s/g,"&");
    console.log(formData);
    try {
        const response = await axios.get('/teller/customers/search', 
        {params: {Name: formData.Name}});
    if(response.data) {
        console.log('success:', response.data);
        setSearchCustomers(response.data);
        setSearchFound(true);
    }
    else {
        console.log('error!', error)
        setError(error);
    }
} catch (error) {
    setError(error);
    console.log('error', error);
}
}; 

    useEffect(() => {
        if (user) {
          axios.get('/user', {})
            .then((response) => {
              if (response.status === 200) {
                setUserData(response.data);
                setLoading(false);
              }
            })
            .catch((error) => {
              setError(error);
              setLoading(false);
            });
        }
      
        axios.get('/teller/customers')
          .then((response) => {
            if (response.status === 200) {
              setCustomers(response.data);
            }
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching customers:', error);
            setLoading(false);
          });
      }, [user]);

    return (
        <div className='container'>
            <h1>Customer List</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>ERROR: {error.message}</p>
            ) : searchFound ? (
              <div>
              <ul>
                  {searchCustomers.map((customer, index) => (
                      <li key={index}>
                        <p>{customer.FirstName} {customer.LastName}
                          <button onClick={() => handleViewCustomerClick(customer)}>View</button></p>
                          </li>
                      
                   ))}
              </ul>
          </div>
            ) : customers ? (
              <div>
                <form onSubmit={handleSubmit} className='search-form'>
                        <div>
                            <label htmlFor="Name">Search Users by Name</label>
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
                            <button type="submit">Search</button>
                        </div>
                    </form>                     
                <ul>
                    {customers.map((customer, index) => (
                        <li key={index}>
                            <p>{customer.FirstName} {customer.LastName}
                            <button onClick={() => handleViewCustomerClick(customer)}>View</button></p>
                        </li>
                    ))}
                </ul>
                </div>                        
            ) : null }
            <button onClick={handleBackButtonClick}>Back</button>
        </div>
    )
}
export default TellerCustomerManage;