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

interface CancelEventModalStore {
  isOpen: boolean;
  eventId: string | null;
  onOpen: (eventId: string) => void;
  onClose: () => void;
}

export const useCancelEventModal = create<CancelEventModalStore>((set) => ({
  isOpen: false,
  eventId: null,
  onOpen: (eventId) => set({ isOpen: true, eventId }),
  onClose: () => set({ isOpen: false, eventId: null }),
}));

interface DeleteEventModalStore {
  open: boolean;
  eventId: string | null;
  onDeleteModalOpen: (eventId: string) => void;
  onDeleteModalClose: () => void;
}

export const useDeleteEventModal = create<DeleteEventModalStore>((set) => ({
  open: false,
  eventId: null,
  onDeleteModalOpen: (eventId) => set({ open: true, eventId }),
  onDeleteModalClose: () => set({ open: false, eventId: null }),
}));
