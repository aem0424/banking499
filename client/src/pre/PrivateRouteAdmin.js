import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRouteAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('/user/role');
        const role = response.data;
        console.log(role);
        setIsAdmin(role === 'Administrator');
      } catch (error) {
        console.error('Error fetching user role:', error);
        // If there's an error fetching the user role, redirect to the home page
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return <div className='container'>Loading...</div>;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRouteAdmin;

