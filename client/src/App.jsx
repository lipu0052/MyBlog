import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Nav from "./components/Navbar";
import Footer from "./components/Footer";
import SignUp from "./pages/SignUp";
import Signin from "./pages/Signin";
import PrivateRoute from "./route/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import OnlyAdminPrivateRoute from "./route/OnlyAdminPrivateRoute";
import Post from "./pages/Post";
import EditPost from "./pages/EditPost";
import PostPage from "./pages/PostPage";
import Subscribe from "./pages/Subscribe"; // Import Subscribe page

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
          <Route path="/editpost/:postId" element={<EditPost />} />
        </Route>
        <Route path="/post/:postId" element={<PostPage />} />
        <Route path="/subscribe" element={<Subscribe />} /> {/* Add Subscribe route */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
