import React, { useState, useEffect, useRef } from 'react';

export function ChatBox() {
  const websocketUrl = 'wss://af948fa0-my-websocket-worker.ptson117.workers.dev/mesage'
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize WebSocket connection
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
          setIsProcessing(true); // Disable input during progress
        } else if (data.response) {
          setMessages((prev) => [...prev, { type: 'response', content: data.response }]);
          setIsProcessing(false); // Re-enable input after response
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

    // Cleanup on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [websocketUrl]);

  // Handle sending messages
  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing || !ws.current || ws.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const message = { message: input.trim() };
    ws.current.send(JSON.stringify(message));
    setMessages((prev) => [...prev, { type: 'user', content: input }]);
    setInput('');
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chatbox-input" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isProcessing ? 'Processing...' : 'Type your message...'}
          disabled={isProcessing}
        />
        <button type="submit" disabled={isProcessing || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};