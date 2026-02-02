import { v4 as uuidV4 } from "uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Chat } from "./schemas/Chat";

type ChatStoreType = {
  currentChat: Chat | undefined;
  setCurrentChat: (chat: Chat) => void;
};

export const useChatStore = create<ChatStoreType>()((set) => ({
  currentChat: undefined,
  setCurrentChat: (chat) => set(() => ({ currentChat: chat })),
}));

type Message = {
  id: string;
  message: string;
  isBotReply: boolean;
};

type MessageStore = {
  showMessages: boolean;
  userId: string;
  isBotTyping: boolean;
  setUserId: (id: string) => void;
  messages: Message[];
  addMessage: (message: string, isBotReply: boolean) => void;
  setBotTyping: (isTyping: boolean) => void;
  setShowMessages: (show: boolean) => void;
  clearMessages: () => void;
};

const useMessageStore = create<MessageStore>()(
  persist(
    (set) => ({
      userId: "",
      showMessages: false,
      messages: [],
      isBotTyping: false,
      setUserId: (id) => set({ userId: id }),

      addMessage: (message, isBotReply) =>
        set((state) => ({
          messages: [...state.messages, { id: uuidV4(), message, isBotReply }],
        })),
      setBotTyping: (isTyping) => set({ isBotTyping: isTyping }),
      setShowMessages: (value) => set({ showMessages: value }),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: "message-storage",
    }
  )
);

export default useMessageStore;

export interface JobOverview {
  title: string;
  category: string;
  jobType: string;
  company: string;
  location: string;
}

interface JobOverviewStore {
  overview: JobOverview | null;
  saveOverview: (data: JobOverview) => void;
  clear: () => void;
}

export const useJobOverviewStore = create<JobOverviewStore>()(
  persist(
    (set) => ({
      overview: null,
      saveOverview: (data) => set({ overview: data }),
      clear: () => set({ overview: null }),
    }),
    {
      name: "job-overview-storage",
    }
  )
);

export interface JobSkills {
  requiredExperienceLevel: string;
  requiredSkills: string[];
}

interface JobSkillsStore {
  jobSkills: JobSkills | null;
  saveSkills: (data: JobSkills) => void;
  clear: () => void;
}

export const useJobSkillsStore = create<JobSkillsStore>()(
  persist(
    (set) => ({
      jobSkills: null,
      saveSkills: (data) => set({ jobSkills: data }),
      clear: () => set({ jobSkills: null }),
    }),
    {
      name: "job-skills-storage",
    }
  )
);

export interface JobScopeAndBudget {
  duration: string;
  budgetType: string;
  budgetAmount: number;
  description: string;
}

interface JobScopeAndBudgetStore {
  jobScopeAndBudget: JobScopeAndBudget | null;
  saveJobScopeAndBudget: (data: JobScopeAndBudget) => void;
  clear: () => void;
}

export const useJobScopeAndBudgetStore = create<JobScopeAndBudgetStore>()(
  persist(
    (set) => ({
      jobScopeAndBudget: null,
      saveJobScopeAndBudget: (data) => set({ jobScopeAndBudget: data }),
      clear: () => set({ jobScopeAndBudget: null }),
    }),
    {
      name: "job-scope-and-budget-storage",
    }
  )
);

interface Step {
  step: number;
  setStep: (step: number) => void;
}

export const useStepStore = create<Step>()((set) => ({
  step: 1,
  setStep: (data) => set({ step: data }),
}));

interface DashboardStep {
  step: number;
  setStep: (step: number) => void;
}

export const useDashboardStepStore = create<DashboardStep>()((set) => ({
  step: 1,
  setStep: (data) => set({ step: data }),
}));
