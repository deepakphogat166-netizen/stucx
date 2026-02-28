import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

function Dashboard({ user }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user.email}</p>
      <button onClick={() => signOut(auth)}>Logout</button>

      <h3>User Records</h3>
      <table border="1" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Join Date</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.joinDate}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="3">No records found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;