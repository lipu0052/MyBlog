import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from '../pages/Post'
import { Outlet, Navigate } from 'react-router-dom';

const OnlyAdminPrivateRoute = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await fetch('https://3001-lipu0052-myblog-41hg32rb1tg.ws-us114.gitpod.io/userdata', {
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
                if(!data.isAdmin){
                    navigate('/signin')
                }


            } catch (error) {

                console.error('Error fetching user data:', error);

            }
        };
        getUser();
    }, []);

    return (
        <div>
            {user && user.isAdmin ? (
                <Post />
                // Render dashboard content with user data
            ) : (
                <div className="flex  mt-40 justify-center min-h-screen">
                    Loading...
                </div>

            )
            }
        </div>
    );


}



export default OnlyAdminPrivateRoute;