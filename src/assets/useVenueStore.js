import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useVenueStore = create(
    persist(
        (set) => ({
            venues: [],
            setVenues: (venues) => set({ venues }),
            isLoaded: false,
            setIsLoaded: (loaded) => set({ isLoaded: loaded }),
        }),
        {
            name: "venue-storage",
            partialize: (state) => ({
                venues: state.venues,
                isLoaded: state.isLoaded,
            }),
        }
    )
);
