import React, { useState } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Nav from "./components/Navbar";
import Footer from "./components/Footer";
import SignUp from "./components/SignUp";
import Signin from "./components/Signin";
import PrivateRoute from "./route/PrivateRoute";
import Dashboard from "./components/Dashboard";
import OnlyAdminPrivateRoute from "./route/OnlyAdminPrivateRoute";
import Post from "./pages/Post";

const App = () => {

  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<Signin />} />
        <Route element={<PrivateRoute />} >
          <Route path="/dashboard" element={<Dashboard />} />

        </Route>
        <Route element={<OnlyAdminPrivateRoute />} >
          <Route path="/post" element={<Post />} />

        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
