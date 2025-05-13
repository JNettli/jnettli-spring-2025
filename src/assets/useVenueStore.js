import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useVenueStore = create(
    persist(
        (set, get) => ({
            venues: [],
            isLoaded: false,
            searchQuery: "",
            isSearchMode: false,
            setVenues: (venues) => set({ venues }),
            setIsLoaded: (loaded) => set({ isLoaded: loaded }),
            setSearchQuery: (q) => set({ searchQuery: q }),
            setIsSearchMode: (val) => set({ isSearchMode: val }),
            clearSearch: () => set({ searchQuery: "", isSearchMode: false }),
            searchVenues: (query) => {
                const q = query.toLowerCase();
                return get().venues.filter(
                    (venue) =>
                        venue.name.toLowerCase().includes(q) ||
                        venue.location?.address?.toLowerCase().includes(q) ||
                        venue.location?.city?.toLowerCase().includes(q) ||
                        venue.location?.country?.toLowerCase().includes(q) ||
                        venue.description?.toLowerCase().includes(q)
                );
            },
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
