import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRouteCustomer = () => {
  const [isCustomer, setIsCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('/user/role');
        const role = response.data;
        console.log(role);
        setIsCustomer(role === 'Customer');
      } catch (error) {
        console.error('Error fetching user role:', error);
        setIsCustomer(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return <div className='container'>Loading...</div>;
  }

  return isCustomer ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRouteCustomer;