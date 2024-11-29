import { create } from "zustand";

interface TicketSelectorModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useTicketSelectorModal = create<TicketSelectorModalStore>(
  (set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  })
);
