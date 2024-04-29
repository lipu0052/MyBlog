import React, { useEffect, useState } from 'react';
import { Sidebar } from 'flowbite-react';
import { HiUser, HiLogout, HiDotsVertical } from 'react-icons/hi';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const DashSidebar = () => {
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

  return (
    <Sidebar className="w-full md:w-60">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item active={tab === 'profile'} icon={HiUser} label="User" labelColor="dark">
              Profile
            </Sidebar.Item>
          </Link>
          <Link to="/logout">
            <Sidebar.Item icon={HiLogout}  >
              Logout
            </Sidebar.Item>
          </Link>
          
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
