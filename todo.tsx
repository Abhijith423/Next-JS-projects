"use client";

import { useEffect, useState, useRef, ChangeEvent, KeyboardEvent } from "react";

type Task = {
  id: string;
  text: string;
  done: boolean;
};

export default function Home() {
  const [text, setText] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("modern_todos_v1");
      if (raw) setTasks(JSON.parse(raw));
    } catch (e) {
      console.warn("Could not parse tasks", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("modern_todos_v1", JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    const s = text.trim();
    if (!s) return;
    const t: Task = { id: cryptoId(), text: s, done: false };
    setTasks((prev) => [t, ...prev]);
    setText("");
    inputRef.current?.focus();
  }

  function toggleDone(id: string) {
    setTasks((prev) => prev.map((p) => (p.id === id ? { ...p, done: !p.done } : p)));
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((p) => p.id !== id));
  }

  function startEdit(t: Task) {
    setEditingId(t.id);
    setEditingText(t.text);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingText("");
  }

  function saveEdit() {
    if (!editingId) return;
    const s = editingText.trim();
    if (!s) {
      removeTask(editingId);
      cancelEdit();
      return;
    }
    setTasks((prev) => prev.map((p) => (p.id === editingId ? { ...p, text: s } : p)));
    cancelEdit();
  }

  function handleAddKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") addTask();
  }

  function handleEditKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") cancelEdit();
  }

  function clearCompleted() {
    setTasks((prev) => prev.filter((p) => !p.done));
  }

  return (
    <>
      <main className="wrap">
        <div className="card" role="application" aria-labelledby="title">
          <h1 id="title" className="title">
            ✨ Modern Todo
            <span className="sub"> — stylish & fast</span>
          </h1>

          <div className="controls">
            <div className="inputWrap">
              <input
                ref={inputRef}
                value={text}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
                onKeyDown={handleAddKey}
                placeholder="Add a new task and press Enter"
                aria-label="New task"
                className="input"
              />
              <button className="btn add" onClick={addTask} aria-label="Add task">
                ➕
              </button>
            </div>

            <div className="smallControls">
              <button
                className="btn ghost"
                onClick={() => {
                  setTasks([]);
                }}
                title="Clear all"
              >
                Clear all
              </button>
              <button className="btn ghost" onClick={clearCompleted} title="Clear completed">
                Clear done
              </button>
            </div>
          </div>

          <ul className="list" aria-live="polite">
            {tasks.length === 0 && <li className="empty">No tasks yet — add something productive ✌️</li>}

            {tasks.map((t) => (
              <li key={t.id} className={`item ${t.done ? "done" : ""}`}>
                <label className="left" onDoubleClick={() => startEdit(t)}>
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleDone(t.id)}
                    aria-label={`Mark ${t.text} as ${t.done ? "not done" : "done"}`}
                  />
                  {editingId === t.id ? (
                    <input
                      className="editInput"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={handleEditKey}
                      onBlur={saveEdit}
                      autoFocus
                    />
                  ) : (
                    <span className="text">{t.text}</span>
                  )}
                </label>

                <div className="actions">
                  <button className="icon" onClick={() => startEdit(t)} aria-label="Edit">
                    ✏️
                  </button>
                  <button className="icon" onClick={() => removeTask(t.id)} aria-label="Delete">
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <footer className="meta">
            <div>{tasks.filter((p) => !p.done).length} remaining</div>
            <div className="credit">Made with ❤️</div>
          </footer>
        </div>
      </main>

      {}
      <style jsx>{`
        :root {
          --bg1: #0f172a;
          --card: rgba(255, 255, 255, 0.06);
          --glass: rgba(255, 255, 255, 0.04);
          --accent1: #7c4dff;
          --accent2: #4dd0e1;
          --muted: #9aa4b2;
        }

        * {
          box-sizing: border-box;
        }

        html,
        body,
        :root {
          height: 100%;
        }

        .wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(1200px 600px at 10% 20%, rgba(124, 77, 255, 0.12), transparent),
            radial-gradient(1000px 500px at 90% 80%, rgba(77, 208, 225, 0.08), transparent),
            linear-gradient(180deg, #071029 0%, #071529 100%);
          padding: 32px;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
            Arial;
        }

        .card {
          width: 420px;
          max-width: calc(100vw - 48px);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.02));
          border-radius: 14px;
          padding: 24px;
          box-shadow: 0 8px 30px rgba(2, 6, 23, 0.6), 0 1px 0 rgba(255, 255, 255, 0.02) inset;
          backdrop-filter: blur(6px);
          color: #e6eef8;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .title {
          margin: 0 0 12px;
          font-size: 20px;
          letter-spacing: -0.2px;
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .sub {
          color: var(--muted);
          font-size: 12px;
          margin-left: 6px;
          font-weight: 500;
        }

        .controls {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          margin-bottom: 18px;
        }

        .inputWrap {
          display: flex;
          gap: 10px;
          align-items: center;
          flex: 1;
          background: var(--glass);
          padding: 6px;
          border-radius: 10px;
        }

        .input {
          background: transparent;
          border: none;
          outline: none;
          color: #e6eef8;
          padding: 10px;
          font-size: 14px;
          width: 100%;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: transform 150ms ease, box-shadow 150ms ease;
          box-shadow: 0 6px 18px rgba(2, 6, 23, 0.5);
          background: linear-gradient(90deg, var(--accent1), var(--accent2));
          color: #051025;
        }

        .btn.add {
          min-width: 44px;
          height: 44px;
          padding: 0 12px;
        }

        .btn.ghost {
          background: transparent;
          color: var(--muted);
          box-shadow: none;
          border-radius: 8px;
          font-size: 13px;
          padding: 6px 10px;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .btn:active {
          transform: translateY(2px);
        }

        .smallControls {
          display: flex;
          gap: 8px;
        }

        .list {
          list-style: none;
          margin: 0;
          padding: 0;
          max-height: 360px;
          overflow: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .empty {
          text-align: center;
          color: var(--muted);
          padding: 26px 12px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.02);
        }

        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 12px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01));
          border-radius: 10px;
          transition: transform 200ms ease, box-shadow 200ms ease, opacity 180ms ease;
        }

        .item:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(2, 6, 23, 0.45);
        }

        .left {
          display: flex;
          gap: 12px;
          align-items: center;
          cursor: default;
          flex: 1;
        }

        .left input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #7c4dff;
          cursor: pointer;
        }

        .text {
          color: #e6eef8;
          font-size: 15px;
          word-break: break-word;
        }

        .item.done .text {
          text-decoration: line-through;
          color: rgba(230, 238, 248, 0.5);
        }

        .actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .icon {
          background: transparent;
          border: none;
          color: var(--muted);
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          transition: background 120ms ease, transform 120ms ease, color 120ms ease;
        }

        .icon:hover {
          background: rgba(255, 255, 255, 0.03);
          color: #e6eef8;
          transform: translateY(-2px);
        }

        .meta {
          display: flex;
          justify-content: space-between;
          margin-top: 16px;
          color: var(--muted);
          font-size: 13px;
        }

        .credit {
          color: var(--muted);
        }

        .editInput {
          padding: 8px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: rgba(255, 255, 255, 0.02);
          color: #e6eef8;
          width: 100%;
          outline: none;
        }

        @media (max-width: 480px) {
          .card {
            padding: 16px;
          }
          .title {
            font-size: 18px;
          }
        }
      `}</style>
    </>
  );
}

function cryptoId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 9);
}
