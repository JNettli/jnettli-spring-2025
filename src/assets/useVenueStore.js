import { create } from "zustand";
import { persist } from "zustand/middleware";
import { APIVenues } from "../assets/Constants";

const defaultFilter = {
    wifi: undefined,
    parking: undefined,
    pets: undefined,
    breakfast: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    maxGuests: undefined,
    sort: undefined,
};

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

            filters: {
                ...defaultFilter,
            },

            pendingFilters: {
                ...defaultFilter,
            },

            setFilters: (newFilters) => set({ filters: newFilters }),
            setPendingFilters: (pending) => set({ pendingFilters: pending }),

            resetFilters: () =>
                set({
                    filters: {
                        ...defaultFilter,
                    },
                    pendingFilters: {
                        ...defaultFilter,
                    },
                }),

            applyFilters: () =>
                set((state) => ({
                    filters: { ...state.pendingFilters },
                })),

            fetchAllVenues: async () => {
                try {
                    let allVenues = [];
                    let currentPage = 1;
                    let keepFetching = true;

                    while (keepFetching) {
                        const res = await fetch(
                            `${APIVenues}?_owner=true&_bookings=true&sort=rating&limit=100&page=${currentPage}`
                        );
                        const data = await res.json();
                        const venues = data.data;

                        if (venues.length === 0) {
                            keepFetching = false;
                        } else {
                            allVenues = [...allVenues, ...venues];
                            currentPage++;
                        }
                    }

                    set({ venues: allVenues, isLoaded: true });
                } catch (error) {
                    console.error("Failed to fetch all venues:", error);
                }
            },

            refreshVenueStore: async () => {
                await get().fetchAllVenues();
            },
        }),
        {
            name: "venue-storage",
            partialize: (state) => ({
                venues: state.venues,
                isLoaded: state.isLoaded,
                searchQuery: state.searchQuery,
                isSearchMode: state.isSearchMode,
                filters: state.filters,
            }),
        }
    )
);
