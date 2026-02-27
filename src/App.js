import React from 'react';
import Auth from './Auth';

function App() {
  return (
    <div>
      <h1>Welcome to Stucx App</h1>
      <Auth />   {/* ✅ renders your Auth component */}
    </div>
  );
}

export default App;   // ✅ only one defaultexport here
