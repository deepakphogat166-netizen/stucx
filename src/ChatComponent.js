import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc, onSnapshot, orderBy, query } from "firebase/firestore";

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (text.trim() === "") return;
    await addDoc(collection(db, "messages"), {
      sender: auth.currentUser.email,
      text: text,
      timestamp: new Date()
    });
    setText("");
  };

  return (
    <div>
      <h3>Chat Room</h3>
      <div style={{ border: "1px solid #ccc", height: "300px", overflowY: "scroll", padding: "10px" }}>
        {messages.map(msg => (
          <p key={msg.id}><b>{msg.sender}:</b> {msg.text}</p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatComponent;