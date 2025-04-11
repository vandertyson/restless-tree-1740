import { useState } from "react";

export function ChatBox() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Xin chào! Tôi có thể hỗ trợ bạn về gói cước hoặc tài khoản." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "u123", // hoặc lấy từ context
        session_id: "s001", // dùng uuid nếu cần
        messages: newMessages,
        new_message: input
      })
    });

    const data = await res.json();

    const assistantReply = {
      role: "assistant",
      content: data.reply
    };

    const reasoningMessage = data.reasoning
      ? { role: "assistant", content: `🤖 Reasoning:\n${data.reasoning}`, meta: "reasoning" }
      : null;

    setMessages([...newMessages, reasoningMessage, assistantReply].filter(Boolean));
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full w-full p-4">
      <div className="flex-1 overflow-auto space-y-2 mb-2">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-2 rounded max-w-xl whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-blue-100 self-end"
                : m.meta === "reasoning"
                ? "bg-yellow-100 text-sm text-gray-700 self-start"
                : "bg-gray-100 self-start"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && <div className="text-sm text-gray-400">Đang xử lý...</div>}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Nhập câu hỏi hoặc yêu cầu..."
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
