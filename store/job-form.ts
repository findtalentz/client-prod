import { create } from "zustand";
import { persist } from "zustand/middleware";

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
