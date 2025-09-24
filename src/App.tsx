import { useEffect } from 'react';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import { useChat } from './store/chat';

export default function App() {
  const { conversations, newConversation } = useChat();
  useEffect(() => {
    if (conversations.length === 0) newConversation();
  }, []);
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <ConversationList />
      <ChatWindow />
    </div>
  );
}
