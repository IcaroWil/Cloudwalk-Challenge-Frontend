import type { Message } from '../types/chat';

export default function MessageBubble({ m }: { m: Message }) {
  const isUser = m.from === 'user';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      margin: '6px 0'
    }}>
      <div style={{
        maxWidth: 640, padding: 10, borderRadius: 8,
        background: isUser ? '#d1e7ff' : '#eee'
      }}>
        {!isUser && m.agent && (
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
            {m.agent}
          </div>
        )}
        <div>{m.text}</div>
      </div>
    </div>
  );
}
