import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import AuthComponent from "./AuthComponent"; // login/signup form
import Dashboard from "./Dashboard"; // post-login screen

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Welcome to Stucx App</h1>
      {user ? <Dashboard user={user} /> : <AuthComponent />}
    </div>
  );
}

export default App;