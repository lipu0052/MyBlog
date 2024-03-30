import React from "react";
import { Button, Navbar, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";

const Nav = () => {
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
        <form className="flex h-2  ml-auto items-center">
          <TextInput
            type="text"
            placeholder="Search"
            className="hidden sm:inline "
            rightIcon={AiOutlineSearch}
          />
        </form>
        <Button color="light" className="ml-auto h-8 w-10  sm:hidden">
          <AiOutlineSearch />
        </Button>
        <div className="ml-auto items-center flex gap-2 md:order-2">
          <Button color="light" className=" w-12 h-10 hidden sm:inline">
            <FaMoon />
          </Button>
          <Link to="/signin">
            <Button gradientDuoTone={"purpleToBlue"} className="h-8 w-20">
              Sign In
            </Button>
          </Link>
        </div>
      </Navbar>
    </>
  );
};

export default Nav;
