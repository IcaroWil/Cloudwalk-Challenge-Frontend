import { api } from './client';
import type { ChatRequest, ChatResponse } from '../types/chat';

export async function sendChat(req: ChatRequest) {
  const { data } = await api.post<ChatResponse>('/chat', req);
  return data;
}
