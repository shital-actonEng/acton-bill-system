// stores/branchStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Branch {
  pk: number;
  name: string;
  ae_title: string;
}


interface BranchStore {
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch) => void;
}

export const useBranchStore = create<BranchStore>()(
    persist(
      (set) => ({
        selectedBranch: null,
        setSelectedBranch: (branch) => set({ selectedBranch: branch }),
      }),
      {
        name: 'branch-storage', // Key in localStorage
      }
    )
  );
