import React, { useEffect, useState } from 'react';
import { Sidebar } from 'flowbite-react';
import { HiUser, HiLogout, HiDotsVertical } from 'react-icons/hi';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from'react-router-dom';

const DashSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState('');
  const [showMore, setShowMore] = useState(false); // State to toggle the visibility of additional sidebar items

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const logoutFunction = async () => {
    try {
      const response = await fetch('https://3001-lipu0052-myblog-41hg32rb1tg.ws-us110.gitpod.io/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',

        },
        credentials: 'include',
      });
      

      if (response.status === 200) {
        window.alert('Successfully logged out');
        navigate('/signup');

      }

    } catch (error) {
      console.error('Error fetching user data:', error);

    }
  }
  const handleLogout = async () => {
    try {
      const confirmed = window.confirm('Are you sure you want to log out?');
  
      if (confirmed) {
        await logoutFunction();
      } else {
        // User clicked Cancel
        // Handle the cancel action, such as staying on the current page or any other action you desire
      }
    } catch (error) {
      console.error('Error logging out:', error);
      // Optionally, show an alert or handle the error in some other way
    }
  };
  
  

  return (
    <Sidebar className="w-full md:w-60">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item as="div" active={tab === 'profile'} icon={HiUser} label="User" labelColor="dark">
              Profile
            </Sidebar.Item>
          </Link>
          <Link >
            <Sidebar.Item icon={HiLogout} onClick={handleLogout} >
              Logout
            </Sidebar.Item>
          </Link>
          
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
