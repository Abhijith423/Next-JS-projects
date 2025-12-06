"use client";

import { useEffect, useRef, useState, FormEvent } from "react";

type User = { username: string; email: string };
type Message = { id: string; author: string; text: string; self: boolean };

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(true);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function submitUser(e: FormEvent) {
    e.preventDefault();
    if (!username.trim() || !email.trim()) return;

    const newUser = { username, email };
    setUser(newUser);
    setShowModal(false);

    setMessages((m) => [
      ...m,
      { id: rand(), author: "System", text: `${username} joined 🎉`, self: false },
    ]);
  }
  function sendMessage() {
    if (!draft.trim()) return;

    setMessages((m) => [
      ...m,
      { id: rand(), author: user!.username, text: draft, self: true },
    ]);

    setDraft("");
  }

  return (
    <>
      {}
      <div className="page">
        <div className="chatBox">

          {}
          <header className="header">
            <h2>💬 Modern Chat</h2>
            {user && (
              <div className="userTag">
                {user.username} — {user.email}
              </div>
            )}
          </header>

          {}
          <div className="messages">
            {messages.map((m) => (
              <div key={m.id} className={`msg ${m.self ? "self" : "other"}`}>
                {!m.self && <div className="author">{m.author}</div>}
                <div className="bubble">{m.text}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {}
          <div className="inputBar">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message…"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      </div>

      {}
      {showModal && (
        <div className="modalOverlay">
          <div className="modal">

            <h2>Enter Chat</h2>

            <form onSubmit={submitUser}>
              <input
                className="inp"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                className="inp"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button className="modalBtn">Join</button>
            </form>
          </div>
        </div>
      )}

      {}
      <style jsx>{`
        .page {
          height: 100vh;
          background: #0f172a;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .chatBox {
          width: 100%;
          max-width: 900px;
          height: 80vh;
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .header {
          padding: 18px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .userTag {
          font-size: 13px;
          opacity: 0.7;
        }

        .messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          color: #fff;
        }

        .msg {
          margin-bottom: 12px;
          max-width: 70%;
        }

        .self {
          margin-left: auto;
          text-align: right;
        }

        .bubble {
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          padding: 10px 14px;
          border-radius: 14px;
          display: inline-block;
        }

        .other .bubble {
          background: rgba(255, 255, 255, 0.1);
        }

        .author {
          font-size: 12px;
          opacity: 0.7;
          margin-bottom: 3px;
        }

        .inputBar {
          display: flex;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px;
          gap: 10px;
        }

        .inputBar input {
          flex: 1;
          padding: 12px;
          border-radius: 10px;
          border: none;
          outline: none;
          font-size: 15px;
        }

        .inputBar button {
          width: 50px;
          border: none;
          background: #3b82f6;
          color: #fff;
          font-size: 18px;
          border-radius: 10px;
          cursor: pointer;
        }

        /* MODAL */
        .modalOverlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal {
          width: 100%;
          max-width: 380px;
          background: #1e293b;
          padding: 24px;
          border-radius: 20px;
          color: #fff;
          text-align: center;
        }

        .inp {
          display: block;
          width: 100%;
          margin: 10px 0;
          padding: 12px;
          border-radius: 10px;
          border: none;
          outline: none;
        }

        .modalBtn {
          width: 100%;
          padding: 12px;
          margin-top: 10px;
          background: #3b82f6;
          border: none;
          color: #fff;
          font-size: 16px;
          border-radius: 10px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
function rand() {
  return Math.random().toString(36).substring(2, 10);
}
