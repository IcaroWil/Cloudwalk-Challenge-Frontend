import { create } from 'zustand';
import type { Conversation, Message, Agent } from '../types/chat';
import { sendChat } from '../api/chat';

type State = {
  conversations: Conversation[];
  activeId: string | null;
  loading: boolean;
  error?: string;
};
type Actions = {
  newConversation: () => string;
  setActive: (id: string) => void;
  send: (userId: string, text: string) => Promise<void>;
};

const randId = () => Math.random().toString(36).slice(2);

export const useChat = create<State & Actions>((set, get) => ({
  conversations: [],
  activeId: null,
  loading: false,

  newConversation: () => {
    const id = `conv-${randId()}`;
    const conv: Conversation = { id, title: 'New chat', messages: [] };
    set((s) => ({ conversations: [conv, ...s.conversations], activeId: id }));
    return id;
  },

  setActive: (id) => set({ activeId: id }),

  send: async (userId, text) => {
    const { activeId, conversations } = get();
    if (!activeId) return;

    const userMsg: Message = {
      id: randId(),
      from: 'user',
      text,
      timestamp: Date.now(),
    };
    set({
      conversations: conversations.map((c) =>
        c.id === activeId ? { ...c, messages: [...c.messages, userMsg] } : c
      ),
      loading: true,
      error: undefined,
    });

    try {
      const res = await sendChat({
        user_id: userId,
        conversation_id: activeId,
        message: text,
      });

      const agent = (res.agent_workflow.at(-1)?.agent ?? 'RouterAgent') as Agent;
      const agentMsg: Message = {
        id: randId(),
        from: 'agent',
        text: res.response,
        timestamp: Date.now(),
        agent,
      };

      set((s) => ({
        conversations: s.conversations.map((c) =>
          c.id === activeId ? { ...c, messages: [...c.messages, agentMsg] } : c
        ),
      }));
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? 'Failed to send message' });
    } finally {
      set({ loading: false });
    }
  },
}));
