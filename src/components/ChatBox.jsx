import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export function ChatBox() {
  const websocketUrl = "wss://8787-vandertyson-restlesstre-xnr399i6hhz.ws-us118.gitpod.io/message"
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    ws.current = new WebSocket(websocketUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setMessages((prev) => [...prev, { type: 'system', content: 'Connected to chat server' }]);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received:', data);

        if (data.error) {
          setMessages((prev) => [...prev, { type: 'error', content: data.error }]);
          setIsProcessing(false);
        } else if (data.progress) {
          setMessages((prev) => [...prev, { type: 'progress', content: data.progress }]);
          // Không đặt lại isProcessing ở đây để giữ typing cho đến response/error
        } else if (data.response) {
          setMessages((prev) => [...prev, { type: 'response', content: data.response }]);
          setIsProcessing(false);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        setMessages((prev) => [...prev, { type: 'error', content: 'Error parsing server message' }]);
        setIsProcessing(false);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setMessages((prev) => [...prev, { type: 'error', content: 'WebSocket error occurred' }]);
      setIsProcessing(false);
    };

    ws.current.onclose = () => {
      console.log('WebSocket closed');
      setMessages((prev) => [...prev, { type: 'system', content: 'Disconnected from chat server' }]);
      setIsProcessing(false);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [websocketUrl]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing || !ws.current || ws.current.readyState !== WebSocket.OPEN) {
      return;
    }

    setIsProcessing(true); // Bật typing ngay khi gửi
    const message = { message: input.trim() };
    ws.current.send(JSON.stringify(message));
    setMessages((prev) => [...prev, { type: 'user', content: input }]);
    setInput('');
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.type}`}>
            {msg.type === 'user' && (
              <img src="https://via.placeholder.com/40?text=U" alt="User Avatar" className="avatar" />
            )}
            {msg.type === 'response' && (
              <img src="https://via.placeholder.com/40?text=D" alt="DeepSeek Avatar" className="avatar" />
            )}
            <div className={`message ${msg.type}`}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="typing-container">
            <div className="typing-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
            <span>Đang xử lý...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="chatbox-input" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isProcessing ? 'Đang xử lý...' : 'Nhập tin nhắn...'}
          disabled={isProcessing}
        />
        <button type="submit" disabled={isProcessing || !input.trim()}>
          Gửi
        </button>
      </form>
    </div>
  );
};