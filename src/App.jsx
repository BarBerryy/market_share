import React, { useState } from 'react';
import { LoginScreen, Dashboard } from './components';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <Dashboard />;
}

export default App;
