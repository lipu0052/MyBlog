import React, { useEffect } from "react";
import { Button, Navbar, TextInput, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon ,FaSun } from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {useDispatch,useSelector} from "react-redux";
import {toggleTheme} from  '../redux/themeSlice'

const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {theme} = useSelector((state) => state.theme); // Accessing directly state.theme

  const path = useLocation().pathname;
  const [user, setUser] = React.useState('');
  

  // Function to fetch user profile data
  const fetchUserData = async () => {
    try {
      const response = await fetch('https://3001-lipu0052-myblog-41hg32rb1tg.ws-us110.gitpod.io/userdata', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
         
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      setUser(data);
     
      if (response.status === 401) {
        setUser('');
      }
     

    } catch (error) {
      console.error('Error fetching user data:', error);

    }
  };
  useEffect(() => {
    fetchUserData();
  },[navigate])
  const handleLogout = async () => {
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
        setUser('');
        navigate('/signup');

      }

    } catch (error) {
      console.error('Error fetching user data:', error);

    }
  }
  
  return (
    <>
      <Navbar fluid={true} className="border-b-2">
        <Link
          to="/"
          className="self-center whitespace-nowrap text-sm sm:text-sm font-semibold md:text-bold dark:text-white"
        >
          <span className="px-2 py-1 bg-gradient-to-r rounded-sm from-indigo-500 via-purple-500 to-green-500 text-white ">
            Biswa's{" "}
          </span>
          BLOG
        </Link>
        <form className="flex h-3  ml-auto items-center">
          <TextInput
            type="text"
            placeholder="Search"
            style={{ height: '2rem' }}
            className="hidden sm:inline custom-input  "
            rightIcon={AiOutlineSearch}
          />
        </form>
        <Button color="light" className="ml-auto h-8 w-9  sm:hidden" pill>
          <AiOutlineSearch />
        </Button>

        <div className="ml-auto items-center flex gap-2 md:order-2">

        <Button
            color="light"
            onClick={() => dispatch(toggleTheme())}
            className="w-9 h-8"
            pill
          >
            {theme === 'dark'? <FaSun /> : <FaMoon />}
          </Button>



          {!user || Object.keys(user).length === 0  ? (
            <Link to="/signup">
              <Button gradientDuoTone={"purpleToBlue"} className="h-8 w-30">
                Sign In
              </Button>
            </Link>
          ) : (
            <Dropdown arrowIcon={false} inline label={
              <Avatar
                alt="user"
                img={user.profileImg}
                rounded="small"
              />
            }>
              <Dropdown.Header>
                <span className="text-sm">@{user.name}</span>
              </Dropdown.Header>
              <Dropdown.Header>
                <span className="text-sm">{user.email}</span>
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="color-red  ">
                Logout
              </Dropdown.Item>
            </Dropdown>
            

          )}





          <Navbar.Toggle />
        </div>
        <Navbar.Collapse className="m-auto font-semibold text-dark ">
          <Navbar.Link active={path === "/"} as={"div"}>
            <Link to="/">Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/about"} as={"div"}>
            <Link to="/about">About</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/projects"} as={"div"}>
            <Link to="/projects">Projects</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/dashboard"} as={"div"}>
            <Link to="/dashboard">Dashboard</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Nav;
