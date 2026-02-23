import { create } from "zustand";

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
