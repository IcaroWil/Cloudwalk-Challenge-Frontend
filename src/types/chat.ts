export type Agent = 'RouterAgent' | 'MathAgent' | 'KnowledgeAgent';

export interface ChatRequest {
  user_id: string;
  conversation_id: string;
  message: string;
}

export interface ChatResponse {
  response: string;
  source_agent_response: string;
  agent_workflow: Array<{ agent: Agent; decision?: Agent }>;
}

export interface Message {
  id: string;
  from: 'user' | 'agent';
  text: string;
  timestamp: number;
  agent?: Agent;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}
