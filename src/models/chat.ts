export interface Message {
  user: string;
  message: string;
  timestamp: number;
  sentiment: number;
}

export interface ChatHistory {
  messages: Message[];
}
