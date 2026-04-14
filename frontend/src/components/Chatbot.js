import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaComments } from 'react-icons/fa';
import '../styles/Chatbot.css';

function Chatbot({ isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! 👋 I'm a Krushnat's portfolio assistant. Ask me about Krushnat's projects, experience, skills, or blogs! You can ask 5 questions per 24 hours.",
      sender: 'bot'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionsRemaining, setQuestionsRemaining] = useState(5);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize session ID
  useEffect(() => {
    let id = localStorage.getItem('chatbot_session_id');
    if (!id) {
      id = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chatbot_session_id', id);
    }
    setSessionId(id);
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || questionsRemaining <= 0) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setQuestionsRemaining(prev => prev - 1);

    try {
      console.log("chatbot request: ", inputValue   );        
      // Call backend API
      const backendURL = process.env.REACT_APP_BACKEND_URL || 'https://krushnatkhawale-github-io.onrender.com';
      const response = await fetch(`${backendURL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          sessionId: sessionId
        })
      });

      const data = await response.json();

      if (response.ok) {
        const botMessage = {
          id: messages.length + 2,
          text: data.response,
          sender: 'bot'
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        console.error('Error from backend:', data, data.error);
        const errorMessage = {
          id: messages.length + 2,
          text: data.error || 'Sorry, I encountered an error. Please try again.',
          sender: 'bot'
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: 'Sorry, I\'m having trouble connecting. Please try again later.',
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`chatbot-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Floating Bubble */}
      <button
        className={`chatbot-bubble ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with portfolio assistant"
      >
        {isOpen ? <FaTimes /> : <FaComments />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`chatbot-window ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
          {/* Header */}
          <div className="chatbot-header">
            <h3>Portfolio Assistant</h3>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <div className="message-content">
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="message-content typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input-area">
            <div className="questions-counter">
              Questions remaining: <span>{questionsRemaining}</span>
            </div>
            <div className="input-wrapper">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={questionsRemaining > 0 ? "Ask me anything..." : "Question limit reached. Come back later!"}
                disabled={questionsRemaining <= 0 || isLoading}
                rows="2"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading || questionsRemaining <= 0}
                className="send-btn"
                title="Send message"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
