// ChatComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const sendMessage = async () => {
    const newMessages = [...messages, { text: inputText, user: 'user' }];
    setMessages(newMessages);
    setInputText('');

    try {
      const response = await axios.post('/api/chatgpt', { userMessage: inputText });
      const botMessage = response.data.botMessage;
      const updatedMessages = [...newMessages, { text: botMessage, user: 'bot' }];
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error sending message to ChatGPT:', error);
    }
  };

  useEffect(() => {
    // You can add additional logic here for handling new messages or updates
  }, [messages]);

  return (
    <div>
      <div className="chat-box">
        {messages.map((message, index) => (
          <div key={index} className={message.user === 'user' ? 'user-message' : 'bot-message'}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
