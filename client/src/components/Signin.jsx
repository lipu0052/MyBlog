import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextInput, Label, Button, Alert, Spinner } from "flowbite-react";

const Signin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState();

  const setChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    const { email, password } = user;

    try {
      setLoading(true);
      const res = await fetch("https://xnyrw2-3001.csb.app/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (res.status === 400) {
        setErr("please provide all the field");
      } else if (res.status === 200) {
        setSuccess("Login successfully");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else if (res.status === 401) {
        setErr("Wrong password");
      } else if (res.status === 402) {
        setErr("User not found");
      } else {
        setErr("Something went wrong");
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className=" min-h-screen   mt-10">
      <div className="flex  mx-auto p-4 max-w-sm flex-col md:flex-row items-center gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
          <form onSubmit={handleSubmit}>
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
                  "Sign in"
                )}
              </Button>
            </div>
          </form>
          <p className="text-black-600  text-sm m-3">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:text-blue-700">
              Sign Up
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
      </div>
    </div>
  );
};

export default Signin;
