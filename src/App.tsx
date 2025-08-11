import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header/Header';
import Home from './pages/Home';
import  Transaction from './pages/Transaction';
import Market from './pages/Market';
import Services from './pages/Services';
import Walet from './pages/Walet';
import Footer from "./Components/Footer/Footer.tsx"
function App() {
  return (
    <Router>
      <Header />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Market />} />
          <Route path="/services" element={<Services />} />
          <Route path="/walet" element={<Walet/>} />
          <Route path="/transaction" element={< Transaction />} />
        </Routes>
      </div>
     <Footer/>
    </Router>
  );
}

export default App;
