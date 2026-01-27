import { create } from "zustand";
import type { Customer360Data } from "../mock-data/customer-360";
import { markSchneiderData, getCustomerByName } from "../mock-data/customer-360";

interface Customer360State {
  // Active customer
  activeCustomer: Customer360Data;
  setActiveCustomer: (customer: Customer360Data) => void;

  // Search/lookup
  searchCustomer: (name: string) => void;

  // Animation state for transitions
  isTransitioning: boolean;
  setTransitioning: (transitioning: boolean) => void;
}

export const useCustomer360Store = create<Customer360State>((set) => ({
  // Default to Mark Schneider
  activeCustomer: markSchneiderData,
  setActiveCustomer: (customer) => set({ activeCustomer: customer }),

  // Search by name and update active customer
  searchCustomer: (name) => {
    const customer = getCustomerByName(name);
    set({ isTransitioning: true });
    // Small delay to trigger exit animation before setting new customer
    setTimeout(() => {
      set({ activeCustomer: customer, isTransitioning: false });
    }, 300);
  },

  // Transition state
  isTransitioning: false,
  setTransitioning: (transitioning) => set({ isTransitioning: transitioning }),
}));
