import React, { useEffect, useState } from 'react';
import { Sidebar } from 'flowbite-react';
import { HiUser, HiLogout, HiDotsVertical, HiDocumentText } from 'react-icons/hi';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from'react-router-dom';

const DashSidebar = ({user}) => {
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
      const response = await fetch('http://localhost:3001/logout', {
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
            <Sidebar.Item as="div" active={tab === 'profile'} icon={HiUser} label={user.isAdmin ? 'Admin' : 'User'} labelColor="dark">
              Profile
            </Sidebar.Item>
          </Link>
          {user.isAdmin && (
             <Link to="/dashboard?tab=posts">
             <Sidebar.Item as="div" active={tab === 'posts'} icon={HiDocumentText} >
               Posts
             </Sidebar.Item>
           </Link>
          )}
         
          <Link >
            <Sidebar.Item icon={HiLogout}  onClick={logoutFunction} >
             <span className="text-red-500">Logout</span>
            </Sidebar.Item>
          </Link>
          

          
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
