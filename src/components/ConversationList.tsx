import { useChat } from '../store/chat';

export default function ConversationList() {
  const { conversations, activeId, setActive, newConversation } = useChat();
  return (
    <aside style={{ width: 260, borderRight: '1px solid #ddd', padding: 12 }}>
      <button onClick={newConversation} style={{ width: '100%', marginBottom: 12 }}>
        + New conversation
      </button>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {conversations.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => setActive(c.id)}
              style={{
                width: '100%', textAlign: 'left', padding: 8,
                background: activeId === c.id ? '#f0f6ff' : 'transparent'
              }}
            >
              {c.title} <small style={{ opacity: 0.6 }}>({c.id})</small>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
