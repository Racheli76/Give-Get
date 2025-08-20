import React, { useEffect, useState } from 'react';
import { startChatConnection, stopChatConnection, sendMessage } from '../../services/chatService';
import { getChatHistory } from '../../apis/chatApi';
import { getProfileImage } from '../../apis/userApi';
import { MessageType, ChatBoxPropsType } from '../../Types/123types';
import defaultUserImage from '../../assets/images/default-user.png';
import '../../styles/ChatBox.css';

const ChatBox: React.FC<ChatBoxPropsType> = ({ userId, exchangeId, otherUserId }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState<string>('');
  const [userImages, setUserImages] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const initChat = async () => {
      try {
        const history = await getChatHistory(exchangeId);
        setMessages(history);
        console.log('Chat history:', history.map((msg) => msg.text));

        // טעינת תמונות עבור המשתמשים
        const images = {
          [userId]: await getProfileImage(userId), // תמונת המשתמש הנוכחי
          [otherUserId]: await getProfileImage(otherUserId), // תמונת המשתמש השני
        };
        setUserImages(images);

        await startChatConnection(userId, exchangeId, (msg) => {
          setMessages((prev) => [...prev, msg]);
        });
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initChat();

    return () => {
      stopChatConnection();
    };
  }, [userId, exchangeId, otherUserId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    console.log('Sending message:', input);
    await sendMessage(exchangeId, userId, input); // שליחת הודעה למשתמש הנוכחי
    setInput('');
  };

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.fromId === userId ? 'sent' : 'received'}`}
          >
            <img
              src={userImages[msg.fromId] || defaultUserImage}
              alt="User"
              className="user-image"
            />
            <div className="message-content">
              <p>{msg.text}</p>
              <small>{new Date(msg.time).toLocaleString()}</small>
            </div>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="כתוב הודעה..."
        />
        <button type='submit' onClick={handleSend}>שלח</button>
      </div>
    </div>
  );
};

export default ChatBox;
