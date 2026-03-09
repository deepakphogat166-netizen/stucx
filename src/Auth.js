import React, { useState } from 'react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");   // extra field for profile
  const [bio, setBio] = useState("");     // optional profile field

  // ✅ Sign Up (Register)
  const handleSignUp = async () => {
    if (!name.trim()) {
      alert("Please enter your full name");
      return;
    }

    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Build profile object
      const newProfile = {
        uid: user.uid,
        name: name,
        email: user.email,
        bio: bio.trim() || "🖐 New to Stucx!",
        coins: 50, // give starter coins
        createdAt: new Date().toISOString()
      };

      // Save profile to Firestore
      await setDoc(doc(db, "users", user.uid), newProfile);

      console.log("Account created successfully!", newProfile);
      alert("Account created successfully!");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Error: " + error.message);
    }
  };

  // ✅ Login (with Firestore profile fetch)
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user profile from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const profile = userDoc.data();
        console.log("User profile loaded:", profile);

        // Example: show profile info in UI
        alert(`Welcome back, ${profile.name}!`);
      } else {
        console.log("No profile found for this user.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div>
      <h2>Auth Component</h2>
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

