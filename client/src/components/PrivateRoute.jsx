import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import {useNavigate} from'react-router-dom';

const PrivateRoute = () => {
    const [user, setUser] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await fetch('https://3001-lipu0052-myblog-41hg32rb1tg.ws-us110.gitpod.io/userdata', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    },
                    credentials: 'include',
                });
                    const data = await response.json();
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
            <Outlet />
            // Render dashboard content with user data
          ) : null  
          }
        </div>
      );
   
    
}

export default PrivateRoute;
