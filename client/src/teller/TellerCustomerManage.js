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

      const [currentPage, setCurrentPage] = useState(1);
      const itemsPerPage = 10;
    
      const handleLoadMore = () => {
        setCurrentPage(currentPage + 1);
      };
    
      const handleLoadPrevious = () => {
        setCurrentPage(currentPage - 1);
      };
  
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = currentPage * itemsPerPage;

    return (
        <div className='container'>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>ERROR: {error.message}</p>
            ) : (
            <div>
                  <h1>Customer List</h1>
                  {searchFound ? (
            <div>
              {searchCustomers.length > 0 ?(
                <table className='striped-table'>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchCustomers
                    .sort((a,b) => a.LastName.localeCompare(b.LastName))
                    .slice(startIndex,endIndex)
                    .map((customer, index) => (
                      <tr key = {index}>
                        <td>{customer.LastName}, {customer.FirstName} </td>
                        <td>
                          <button onClick={() => handleViewCustomerClick(customer)}>View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ):(
                <p style={{color:'red'}}>No Customers Found</p>
              )}          
          </div>
            ) : (
              <div>
                <form onSubmit={handleSubmit} className='search-form'>
                        <div>
                            <label htmlFor="Name" className='form-label'>Search Users by Name</label>
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
                            <button type="submit" className='submit-button'>Search</button>
                        </div>
                    </form>                     
                  {customers.length> 0 ? (
                    <table className='striped-table'>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.sort((a,b) => a.LastName.localeCompare(b.LastName)).slice(startIndex,endIndex).map((customer,index) => (
                          <tr key={index}>
                            <td>{customer.LastName}, {customer.FirstName}</td>
                            <td>
                              <button onClick={() => handleViewCustomerClick(customer)}>View</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    ) : (
                          <p style={{ color: 'red' }}>No Active Customers</p>
                        )}
                        {startIndex > 0 && (
                          <button onClick={handleLoadPrevious} className='form-button'>Load Previous Customers</button>
                        )}
                        {endIndex < customers.length && (
                          <button onClick={handleLoadMore} className='form-button'>Load More Customers</button>
                        )}
                </div> 
            )}                       
            <button onClick={handleBackButtonClick} className='form-button'>Back</button>
        </div>
            )}
            </div>
    );
}
export default TellerCustomerManage;