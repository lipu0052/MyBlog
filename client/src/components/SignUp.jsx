import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextInput, Label, Button, Alert, Spinner } from "flowbite-react";
import GoogleAuth from "./GoogleAuth";

const SignUp = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState();

  const setChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    const { name, email, password } = user;

    try {
      setLoading(true);
      const res = await fetch("https://xnyrw2-3001.csb.app/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      if (res.status === 401) {
        setErr("Email already exist");
      } else if (res.status === 201) {
        setSuccess("register successfully");
        setTimeout(() => {
          navigate("/signin");
        }, 1000);
      } else if (res.status === 400) {
        setErr("please provide all the field");
      } else {
        setErr("something went wrong");
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  const handleSuccess = () => {
    setSuccess("Signup successfully");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className=" min-h-screen mt-10    ">
      <div className="flex max-w-xl mx-auto p-4  flex-col md:flex-row items-center gap-4">
        {/* left */}
        <div className="flex-1 order-2 md:order-1">
          <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <Label value="Name" />
              <TextInput
                onChange={setChange}
                value={user.name}
                type="text"
                id="name"
                name="name"
                className="mt-1 block  w-auto rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-2">
              <Label value="Email" />
              <TextInput
                onChange={setChange}
                value={user.email}
                type="email"
                id="email"
                name="email"
                className="mt-1 block  w-auto rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-2">
              <Label value="Password" />
              <TextInput
                onChange={setChange}
                value={user.password}
                type="password"
                id="password"
                name="password"
                className="mt-1 block  w-auto rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <Button
                type="submit"
                gradientDuoTone="purpleToBlue"
                className="w-full  h-10"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>
              <GoogleAuth onSuccess={handleSuccess} />
            </div>
          </form>
          <p className="text-black-600  text-sm m-3">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-500 hover:text-blue-700">
              Login
            </Link>
          </p>
          {err ? (
            <Alert className="text-red-500 text-sm mt-2">{err}</Alert>
          ) : (
            success && (
              <Alert className="text-green-500 text-sm mt-2">{success}</Alert>
            )
          )}
        </div>
        {/* right */}
        <div className=" flex-1 order-1    ">
          <Link className=" font-bold text-2xl dark:text-white">
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
