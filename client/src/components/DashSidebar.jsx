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

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const logoutFunction = async () => {
    try {
      const response = await fetch('https://3001-lipu0052-myblog-41hg32rb1tg.ws-us114.gitpod.io/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',

        },
        credentials: 'include',
      });
      

      if (response.status === 200) {
        navigate('/signup');

      }

    } catch (error) {
      console.error('Error fetching user data:', error);

    }
  }
  
  
  

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
            <Sidebar.Item icon={HiLogout}  onClick={logoutFunction} >
             <span className="text-red-500">Logout</span>
            </Sidebar.Item>
          </Link>
          <Link >
          


          </Link>

          
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
