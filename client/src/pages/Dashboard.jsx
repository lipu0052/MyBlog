import React,{useEffect,useState} from "react";
import {useLocation} from "react-router-dom"
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import PrivateRoute from "../route/PrivateRoute";
import DashPost from "../components/DashPost";
import DashUsers from "../components/DashUsers";


const Dashboard = ({user}) => {
  const location = useLocation();
  const[tab,setTab] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl)
    }
  }, [location.search]);
  return (
    <>
    <div className="min-h-screen flex flex-col md:flex-row ">
  
    <div className="md:w-50">
      {/* sidebar */}
      <DashSidebar user={user} />
      
      
    </div>
    {/* profile */} 
    {tab === 'profile' && <DashProfile user={user} />}

    {/* posts */}
    {tab === 'posts' && <DashPost />}

    {/*users */}
    {tab === 'users' && <DashUsers />}


    </div>
    
       
    </>
  );
};

export default Dashboard;
