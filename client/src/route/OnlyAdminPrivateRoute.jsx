import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const OnlyAdminPrivateRoute = () => {
    const [user, setUser] = useState(null);

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
                setUser(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        getUser();
    }, []);

    if (user === null) {
        return (
            <div className="flex mt-40 justify-center min-h-screen">
                Loading...
            </div>
        );
    }

    return user.isAdmin ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default OnlyAdminPrivateRoute;
