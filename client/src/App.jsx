import React, { useState } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Nav from "./components/Navbar";
import Footer from "./components/Footer";
import SignUp from "./components/SignUp";
import Signin from "./components/Signin";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard";

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
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
