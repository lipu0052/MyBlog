import React,{useEffect,useState} from "react";
import {useLocation} from "react-router-dom"
import DashSidebar from "./DashSidebar";
import DashProfile from "./DashProfile";
import PrivateRoute from "../route/PrivateRoute";


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
      <DashSidebar/>
      
      
    </div>
    {/* profile */}
    {tab === 'profile' && <DashProfile user={user} />}

    </div>
    
       
    </>
  );
};

export default Dashboard;
