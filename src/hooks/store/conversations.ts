import { create } from 'zustand';

interface ConversationsState {
  conversations: any[];
  isLoading: boolean;
  activeId: string | null;
  setConversations: (conversations: any[]) => void;
  addConversation: (conversation: any) => void;
  removeConversation: (id: string) => void;
  setActiveId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  markAsRead: (id: string) => void;
}

export const useConversationsStore = create<ConversationsState>((set: any) => ({
  conversations: [],
  isLoading: true,
  activeId: null,
  setConversations: (conversations: any[]) =>
    set((state: ConversationsState) => ({
      ...state,
      conversations,
      isLoading: false,
    })),
  addConversation: (conversation: any) =>
    set((state: ConversationsState) => ({
      ...state,
      conversations: [conversation, ...state.conversations],
    })),
  removeConversation: (id: string) =>
    set((state: ConversationsState) => ({
      ...state,
      conversations: state.conversations.filter(
        (c: any) => c.id !== id,
      ),
    })),
  setActiveId: (id: string | null) =>
    set((state: ConversationsState) => ({
      ...state,
      activeId: id,
    })),
  setLoading: (loading: boolean) =>
    set((state: ConversationsState) => ({
      ...state,
      isLoading: loading,
    })),
  markAsRead: (id: string) =>
    set((state: ConversationsState) => ({
      ...state,
      conversations: state.conversations.map((c: any) => {
        if (c.id === id) {
          return { ...c, lastReadAt: new Date() };
        }
        return c;
      }),
    })),
}));
