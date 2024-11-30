import { create } from "zustand";

import type { OrderItem } from "@/types";

interface OrderItemStore {
  orderItems: OrderItem[];
  updateOrderItem: (orderItem: OrderItem) => void;
  removeOrderItem: (ticketDetailsId: string) => void;
}

export const useOrderItemStore = create<OrderItemStore>((set) => ({
  orderItems: [],
  updateOrderItem: (orderItem) => {
    set((state) => {
      const existingItemIndex = state.orderItems.findIndex(
        (item) => item.ticketDetailsId === orderItem.ticketDetailsId
      );

      if (existingItemIndex !== -1) {
        // If item exists, update its quantity with the new quantity
        const updatedItems = [...state.orderItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: orderItem.quantity,
        };
        return { orderItems: updatedItems };
      } else {
        // If item doesn't exist, add new item
        return { orderItems: [...state.orderItems, orderItem] };
      }
    });
  },
  removeOrderItem: (ticketDetailsId) =>
    set((state) => ({
      // Remove the item with the specified ticketDetailsId
      orderItems: state.orderItems.filter(
        (item) => item.ticketDetailsId !== ticketDetailsId
      ),
    })),
}));
