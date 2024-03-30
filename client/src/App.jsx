import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Nav from "./components/Navbar";

const App = () => {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
