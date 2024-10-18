import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import {useNavigate} from'react-router-dom';
import Dashboard from '../components/Dashboard';
const PrivateRoute = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await fetch('http://localhost:3001/userdata', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    },
                    credentials: 'include',
                });
                    const data = await response.json();
                    console.log(data);
                    setUser(data);
                    if(response.status === 401) {
                        navigate('/signin');
                    }
                 
            } catch (error) {
                console.error('Error fetching user data:', error);
                
            }
        };
        getUser();
    }, []);

    return (
        <div>
          {user ? (
            <Dashboard user={user} />
            // Render dashboard content with user data
          ) : <div className="flex  mt-40 justify-center min-h-screen">
            Loading...
          </div> 
          }
        </div>
      );
   
    
}

export default PrivateRoute;
