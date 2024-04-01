import React from "react";
import { Link } from "react-router-dom";
import { TextInput, Label } from "flowbite-react";

const SignUp = () => {
  return (
    <div className=" min-h-screen flex items-center justify-center  ">
      <div className="flex max-w-3xl mx-auto p-4 flex-col md:flex-row">
        {/* left */}
        <div className="m-5">
          <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
          <form>
            <div className="mb-2">
              <Label value="Name" />
              <TextInput
                type="text"
                id="name"
                name="name"
                className="mt-1 block  w-auto rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-2">
              <Label value="Email" />
              <TextInput
                type="email"
                id="email"
                name="email"
                className="mt-1 block  w-auto rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-2">
              <Label value="Password" />
              <TextInput
                type="password"
                id="password"
                name="password"
                className="mt-1 block  w-auto rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign Up
              </button>
            </div>
          </form>
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <a href="#" className="text-blue-500 hover:text-blue-700">
              Login
            </a>
          </p>
        </div>
        <div className=" ">
          <Link to="/" className=" font-bold text-2xl dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r rounded-sm from-indigo-500 via-purple-500 to-green-500 text-white ">
              Biswa's{" "}
            </span>
            BLOG
          </Link>
          <p className="text-blac-600 text-sm dark:text-white mt-5 ">
            This is a simple blog application created using React and Tailwind
            CSS.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
