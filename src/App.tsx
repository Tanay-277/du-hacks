import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import Register from './pages/Register';
import Login from './pages/Login';
import { Appbar, Filters, Store } from "./components/blocks";

const Home: React.FC = () => {
  return (
    <main>
      <Appbar />
      <div className="w-full flex flex-row">
        <Filters />
        <Store />
      </div>
    </main>
  )
}

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;