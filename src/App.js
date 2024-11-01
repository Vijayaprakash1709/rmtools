// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './Login';
import Dashboard from './Dashboard';
import RMTool from './RMTool';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rmtool" element={<RMTool />} />
          {/* Add more routes as necessary */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
