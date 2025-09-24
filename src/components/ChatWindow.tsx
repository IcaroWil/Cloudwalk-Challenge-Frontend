import { useChat } from '../store/chat';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

export default function ChatWindow() {
  const { conversations, activeId, send, loading, error } = useChat();
  const conv = conversations.find((c) => c.id === activeId);
  const userId = 'user-frontend';

  if (!conv) {
    return <div style={{ padding: 16 }}>Create a conversation to start chatting.</div>;
  }

  return (
    <section style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 12 }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {conv.messages.map((m) => <MessageBubble key={m.id} m={m} />)}
      </div>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{String(error)}</div>}
      <ChatInput onSend={(t) => send(userId, t)} />
      {loading && <div style={{ fontSize: 12, opacity: 0.6, marginTop: 6 }}>Sending…</div>}
    </section>
  );
}
