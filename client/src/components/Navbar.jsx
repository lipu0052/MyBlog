import React,{useEffect} from "react";
import { Button, Navbar, TextInput,Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";

const Nav = () => {
  const path = useLocation().pathname;
  const [user, setUser] = React.useState({});

  // Function to fetch user profile data
  const fetchUserData = async () => {
    try {
      const response = await fetch('https://3001-lipu0052-myblog-41hg32rb1tg.ws-us110.gitpod.io/userdata', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          
        },
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data);
      setUser(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser({});
    }
  };
  useEffect(() => {
    fetchUserData();
  },[])
  return (
    <>
      <Navbar fluid={true} className="border-b-2">
        <Link
          to="/"
          className="self-center whitespace-nowrap text-sm sm:text-sm font-semibold md:text-bold dark:text-white"
        >
          <span className="px-2 py-1 bg-gradient-to-r rounded-sm from-indigo-500 via-purple-500 to-green-500 text-white ">
{user.name}{" "}
          </span>
          BLOG
        </Link>
        <form className="flex h-2  ml-auto items-center">
          <TextInput
            type="text"
            placeholder="Search"
            className="hidden sm:inline "
            rightIcon={AiOutlineSearch}
          />
        </form>
        <Button color="light" className="ml-auto h-8 w-10  sm:hidden" pill>
          <AiOutlineSearch />
        </Button>
      
        <div className="ml-auto items-center flex gap-2 md:order-2">

          <Button color="light" className=" w-12 h-10 " pill>
            <FaMoon />
          </Button>
          {user ? (
            <>
              <Dropdown arrowIcon={false} inline label={
          <Avatar
          alt="user"
          img={user.profileImg}

         
          rounded="small"
                 
          />
        }>
          </Dropdown>
              <Link to="/logout">
                <Button gradientDuoTone={"purpleToBlue"} className=" w-20 h-8 " >
                  Logout
                </Button>
              </Link>

            </>
          ) : (
            <Link to="/signup">
            <Button gradientDuoTone={"purpleToBlue"} className="h-8 w-30">
              Sign In
              </Button>
             
          </Link>
            
            )
          }
              
          
            
                    
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
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Nav;
