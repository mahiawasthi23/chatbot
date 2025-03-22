import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const Chatbot = () => {
  const [chats, setChats] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState("");

  const key = import.meta.env.VITE_APP_URI;
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;

  const showTyping = async (msagge) => {
    setTyping("");
    for (let i = 0; i < msagge.length; i++) {
      setTyping((prev) => prev + msagge[i]);
      await new Promise((done) => setTimeout(done, 30));
    }
    setChats((prev) => [...prev, { who: "bot", msagge }]);
    setTyping("");
  };

  const sendMsg = async () => {
    if (!text.trim()) return;
    setChats((prev) => [...prev, { who: "me", msagge: text }]);
    const ask = text;
    setText("");

    try {
      const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `${ask}` }],
            },
          ],
        }),
      });
      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply";
      await showTyping(reply);
    } catch {
      setChats((prev) => [...prev]);
    }
  };

  return (
    <div className="chat-contenar">
      <div className="massage-box">
        {chats.map((c, i) => (
          <div key={i} className="msagge">
            <ReactMarkdown>{c.msagge}</ReactMarkdown>
          </div>
        ))}
        {typing && (
          <div className="bot-massage">
           <ReactMarkdown>{typing}</ReactMarkdown>
          </div>
        )}
      </div>
      <div className="input-contenar">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write you massage here"
          onKeyDown={(e) => e.key === "Enter" && sendMsg()}
        />
        <button onClick={sendMsg}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;