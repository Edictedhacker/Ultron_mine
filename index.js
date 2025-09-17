import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const messagesRef = useRef(null);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;
    const userMessage = { role: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");

    const res = await fetch("/api/ultron", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    const aiMessage = { role: "ultron", text: data.output };
    setMessages((prev) => [...prev, aiMessage]);
  };

  useEffect(() => {
    messagesRef.current?.scrollTo(0, messagesRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#111] antialiased">
      <main className="max-w-4xl mx-auto py-10 px-6">
        <header className="mb-6 border-b border-[#ddd] pb-4">
          <h1 className="text-2xl font-bold">ULTRON AI</h1>
          <p className="text-sm text-[#555]">Enterprise Intelligence — Powered Beast</p>
        </header>

        <div
          ref={messagesRef}
          className="h-[70vh] overflow-auto flex flex-col border border-[#ddd] bg-white"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`py-3 px-4 border-b border-[#eee] font-medium ${
                m.role === "user" ? "bg-[#ffffff] text-[#111]" : "bg-[#f9f9f9] text-[#111]"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendPrompt()}
            placeholder="Type your command..."
            className="flex-1 p-3 border border-[#ccc] bg-white outline-none text-[#111]"
          />
          <button
            onClick={sendPrompt}
            className="px-5 py-3 bg-[#111] text-white font-semibold hover:bg-[#333]"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}