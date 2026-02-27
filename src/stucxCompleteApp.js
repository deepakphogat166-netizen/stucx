import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { collection, addDoc, onSnapshot, doc, getDoc, query, orderBy } from 'firebase/firestore';

export default function StucxCompleteApp() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [profile, setProfile] = useState(null); // ✅ logged-in user profile
  const [coins, setCoins] = useState(0);
  const [currentScreen, setCurrentScreen] = useState("main");
  const [isTyping, setIsTyping] = useState(false); // ✅ typing indicator

  // ✅ Real-time listener for Firestore messages (ordered by timestamp)
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // ✅ Load user profile when logged in
  useEffect(() => {
    const fetchProfile = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfile(data);
          if (data.coins) setCoins(data.coins);
        }
      }
    };
    fetchProfile();
  }, []);

  // ✅ Add a new message
  const handleAddMessage = async () => {
    if (newMessage.trim() === "") return;
    await addDoc(collection(db, "messages"), {
      text: newMessage,
      user: profile ? profile.name : "Anonymous",
      email: auth.currentUser ? auth.currentUser.email : "Unknown",
      createdAt: new Date() // Firestore stores as timestamp
    });
    setNewMessage("");
    setIsTyping(false); // reset typing indicator
  };

  // ✅ Format timestamp for display
  const formatTimestamp = (dateObj) => {
    if (!dateObj) return "";
    const date = dateObj.toDate ? dateObj.toDate() : new Date(dateObj);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ✅ Format date labels
  const formatDateLabel = (dateObj) => {
    if (!dateObj) return "";
    const date = dateObj.toDate ? dateObj.toDate() : new Date(dateObj);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // ✅ Group messages by date
  const groupedMessages = messages.reduce((groups, msg) => {
    const dateLabel = formatDateLabel(msg.createdAt);
    if (!groups[dateLabel]) groups[dateLabel] = [];
    groups[dateLabel].push(msg);
    return groups;
  }, {});

  return (
    <div>
      <h2>Stucx Complete App</h2>

      {/* ✅ Show logged-in user profile */}
      {profile && (
        <div style={{ marginBottom: "20px" }}>
          <strong>Logged in as:</strong> {profile.name} <br />
          <em>{profile.bio}</em> <br />
          <span>Coins: {coins}</span>
        </div>
      )}

      {/* ✅ Screen flow example */}
      {currentScreen === "welcome" && (
        <div>
          <h3>Welcome {profile ? profile.name : "User"}!</h3>
        </div>
      )}

      {currentScreen === "main" && (
        <div>
          <input 
            type="text" 
            value={newMessage} 
            onChange={(e) => {
              setNewMessage(e.target.value);
              setIsTyping(e.target.value.trim() !== "");
            }} 
            placeholder="Type a message"
          />
          <button onClick={handleAddMessage}>Add Message</button>

          {/* ✅ Typing indicator */}
          {isTyping && (
            <p style={{ color: "gray", fontStyle: "italic" }}>
              {profile ? profile.name : "Someone"} is typing...
            </p>
          )}

          {/* ✅ Render grouped messages with date labels */}
          {Object.keys(groupedMessages).map((dateLabel) => (
            <div key={dateLabel}>
              <h4 style={{ textAlign: "center", color: "gray" }}>{dateLabel}</h4>
              <ul>
                {groupedMessages[dateLabel].map((msg) => (
                  <li key={msg.id}>
                    <strong>{msg.user}:</strong> {msg.text}
                    <span style={{ marginLeft: "10px", color: "gray", fontSize: "0.9em" }}>
                      {formatTimestamp(msg.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}