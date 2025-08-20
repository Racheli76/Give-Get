import { useParams, useLocation } from 'react-router-dom';
import ChatBox from '../components/specific/ChatBox';

const ChatPage = () => {
  const { exchangeId } = useParams<{ exchangeId: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');  // שליפת ה-userId מה-URL
  const userId2 = queryParams.get('userId2'); // שליפת ה-userId2 מה-URL
  if (!exchangeId || !userId || !userId2) {
    return <div>Exchange ID, User ID or User ID 2 is missing</div>;
  }

  return (
    <div className="chat-page">
      <h2>צ'אט העסקה</h2>
      <ChatBox userId={Number(userId)} exchangeId={Number(exchangeId)} otherUserId={Number(userId2)} />
    </div>
  );
};

export default ChatPage;