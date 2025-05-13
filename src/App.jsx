import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { APIVenues } from "./assets/Constants";
import Filter from "./assets/components/Filter";
import { useVenueStore } from "./assets/useVenueStore";

function App() {
    document.title = "Holidaze | Find your new vacation spot";

    const { ref, inView } = useInView({ threshold: 0.5 });

    const {
        venues,
        setVenues,
        isLoaded,
        setIsLoaded,
        searchQuery,
        isSearchMode,
        searchVenues,
    } = useVenueStore();
    const [filteredVenues, setFilteredVenues] = useState([]);
    const [displayedVenues, setDisplayedVenues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({
        wifi: undefined,
        parking: undefined,
        pets: undefined,
        breakfast: undefined,
    });
    const [pendingFilters, setPendingFilters] = useState(filters);
    const [page, setPage] = useState(1);
    const limit = 20;
    const [scrollTop, setScrollTop] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrollTop(window.scrollY > 200);
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const fetchInitialVenues = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${APIVenues}?_owner=true&_bookings=true&limit=${limit}&page=1&sort=rating`
            );
            const data = await res.json();
            setVenues(data.data);
            setIsLoaded(false);
        } catch (err) {
            console.error("Failed initial fetch:", err);
        } finally {
            setLoading(false);
        }
    }, [setVenues, setIsLoaded]);

    const fetchRemainingVenues = useCallback(async () => {
        if (isLoaded || venues.length >= limit * 2) return;

        let currentPage = 2;
        let allFetched = [...venues];

        try {
            while (true) {
                const res = await fetch(
                    `${APIVenues}?_owner=true&_bookings=true&limit=${limit}&page=${currentPage}&sort=rating`
                );
                const data = await res.json();
                const newData = data.data;

                if (newData.length === 0) break;

                allFetched = [...allFetched, ...newData];
                currentPage++;
            }

            const uniqueMap = new Map();
            allFetched.forEach((v) => uniqueMap.set(v.id, v));
            setVenues(Array.from(uniqueMap.values()));
            setIsLoaded(true);
        } catch (err) {
            console.error("Error loading full venue list:", err);
        }
    }, [venues, setVenues, isLoaded, setIsLoaded]);

    const applyFiltersToVenues = useCallback(() => {
        setDisplayedVenues([]);

        const filtered = venues.filter((venue) => {
            if (filters.wifi !== undefined && venue.meta.wifi !== filters.wifi)
                return false;
            if (
                filters.parking !== undefined &&
                venue.meta.parking !== filters.parking
            )
                return false;
            if (filters.pets !== undefined && venue.meta.pets !== filters.pets)
                return false;
            if (
                filters.breakfast !== undefined &&
                venue.meta.breakfast !== filters.breakfast
            )
                return false;
            return true;
        });

        const uniqueFiltered = Array.from(
            new Map(filtered.map((v) => [v.id, v])).values()
        );

        setFilteredVenues(uniqueFiltered);
        setDisplayedVenues(uniqueFiltered.slice(0, limit));
        setPage(1);
        setHasMore(uniqueFiltered.length > limit);
    }, [venues, filters]);

    const loadMoreVenues = useCallback(() => {
        const nextPage = page + 1;
        const startIndex = page * limit;
        const endIndex = startIndex + limit;
        const moreVenues = filteredVenues.slice(startIndex, endIndex);

        setDisplayedVenues((prev) => {
            const existingIds = new Set(prev.map((v) => v.id));
            const uniqueNewVenues = moreVenues.filter(
                (v) => !existingIds.has(v.id)
            );
            return [...prev, ...uniqueNewVenues];
        });

        setPage(nextPage);
        setHasMore(filteredVenues.length > endIndex);
    }, [filteredVenues, page]);

    useEffect(() => {
        if (venues.length === 0) fetchInitialVenues();
    }, [fetchInitialVenues, venues.length]);

    useEffect(() => {
        if (!isLoaded && venues.length > 0) fetchRemainingVenues();
    }, [venues, isLoaded, fetchRemainingVenues]);

    useEffect(() => {
        applyFiltersToVenues();
    }, [filters, venues, applyFiltersToVenues]);

    useEffect(() => {
        if (isSearchMode && searchQuery) {
            const results = searchVenues(searchQuery);
            setFilteredVenues(results);
            setDisplayedVenues(results.slice(0, limit));
            setPage(1);
            setHasMore(false);
        } else {
            applyFiltersToVenues();
        }
    }, [isSearchMode, searchQuery, venues, applyFiltersToVenues, searchVenues]);

    useEffect(() => {
        if (inView && hasMore && !loading) {
            loadMoreVenues();
        }
    }, [inView, hasMore, loading, loadMoreVenues]);

    const handleApplyFilters = () => setFilters(pendingFilters);

    const handleClearFilters = () => {
        const reset = {
            wifi: undefined,
            parking: undefined,
            pets: undefined,
            breakfast: undefined,
        };
        setFilters(reset);
        setPendingFilters(reset);
    };

    return (
        <>
            <Filter
                filters={pendingFilters}
                onFilterChange={setPendingFilters}
            />
            <div className="flex gap-4 px-4 pb-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleApplyFilters}
                >
                    Apply Filters
                </button>
                <button
                    className="bg-gray-200 px-3 py-2 rounded"
                    onClick={handleClearFilters}
                >
                    Clear Filters
                </button>
            </div>

            <div className="max-w-7xl mx-auto p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {displayedVenues.map((venue) => (
                        <div
                            key={venue.id}
                            className="bg-red-400 rounded-lg p-4"
                        >
                            <Link to={`/venue/${venue.id}`}>
                                <img
                                    src={
                                        venue.media[0]?.url ||
                                        "img/error-image.svg"
                                    }
                                    alt={venue.media[0]?.alt || "Missing alt"}
                                    className="w-full h-40 object-cover rounded"
                                />
                            </Link>
                            <Link
                                to={`/venue/${venue.id}`}
                                className="font-bold text-white"
                            >
                                {venue.name}
                            </Link>
                        </div>
                    ))}
                </div>

                <div ref={ref} className="h-16"></div>

                {loading && (
                    <p className="text-center mt-4">Loading venues...</p>
                )}
                {!loading && !hasMore && displayedVenues.length === 0 && (
                    <p className="text-center text-gray-500 mt-4">
                        No venues match your filters.
                    </p>
                )}
                {!loading && !hasMore && displayedVenues.length > 0 && (
                    <p className="text-center text-gray-500 mt-4">
                        You've reached the end!
                    </p>
                )}
            </div>
            {scrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 text-3xl bg-white outline-[#007A8D] outline-2 rounded-full hover:bg-gray-200 transition cursor-pointer rotate-270"
                    aria-label="Back to top"
                >
                    <p className="mt-0.5 text-[#007A8D]">&#x279C;</p>
                </button>
            )}
        </>
    );
}

export default App;
