import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { APIVenues } from "./assets/Constants";
import Filter from "./assets/components/Filter";
import { useInView } from "react-intersection-observer";

function App() {
    document.title = "Holidaze | Find your new vacation spot";

    const [allVenues, setAllVenues] = useState([]);
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

    const { ref, inView } = useInView({
        threshold: 0.5,
        triggerOnce: false,
    });

    const fetchAllVenues = useCallback(async () => {
        setLoading(true);
        let allFetchedVenues = [];
        let currentPage = 1;
        let moreData = true;

        try {
            while (moreData) {
                const res = await fetch(
                    `${APIVenues}?_owner=true&_bookings=true&sort=rating&limit=${limit}&page=${currentPage}`
                );
                const data = await res.json();
                const newVenues = data.data;

                if (newVenues.length === 0) {
                    moreData = false;
                } else {
                    allFetchedVenues = [...allFetchedVenues, ...newVenues];
                    currentPage += 1;
                }
            }

            setAllVenues(allFetchedVenues);
        } catch (err) {
            console.error("Error loading venues:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const applyFiltersToVenues = useCallback(() => {
        const filtered = allVenues.filter((venue) => {
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

        setFilteredVenues(filtered);
        setDisplayedVenues(filtered.slice(0, limit));
        setPage(1);
        setHasMore(filtered.length > limit);
    }, [allVenues, filters]);

    const loadMoreVenues = useCallback(() => {
        const nextPage = page + 1;
        const startIndex = page * limit;
        const endIndex = startIndex + limit;
        const moreVenues = filteredVenues.slice(startIndex, endIndex);

        setDisplayedVenues((prev) => [...prev, ...moreVenues]);
        setPage(nextPage);
        setHasMore(filteredVenues.length > endIndex);
    }, [filteredVenues, page]);

    useEffect(() => {
        fetchAllVenues();
    }, [fetchAllVenues]);

    useEffect(() => {
        applyFiltersToVenues();
    }, [allVenues, filters, applyFiltersToVenues]);

    useEffect(() => {
        if (inView && hasMore && !loading) {
            loadMoreVenues();
        }
    }, [inView, hasMore, loading, loadMoreVenues]);

    const handleApplyFilters = () => {
        setFilters(pendingFilters);
    };

    const handleClearFilters = () => {
        const reset = {
            wifi: undefined,
            parking: undefined,
            pets: undefined,
            breakfast: undefined,
        };
        setPendingFilters(reset);
        setFilters(reset);
    };

    return (
        <>
            <Filter
                filters={pendingFilters}
                onFilterChange={setPendingFilters}
            />
            <div className="flex gap-4 px-4 pb-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    onClick={handleApplyFilters}
                >
                    Apply Filters
                </button>
                <button
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded transition"
                    onClick={handleClearFilters}
                >
                    Clear All Filters
                </button>
            </div>
            <div className="max-w-7xl mx-auto p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto p-4">
                    {displayedVenues.map((venue) => (
                        <div
                            key={venue.id}
                            className="bg-red-400 rounded-lg p-4 flex flex-col gap-2"
                        >
                            <Link to={`/venue/${venue.id}`}>
                                <img
                                    src={
                                        venue.media[0]?.url ||
                                        "img/error-image.svg"
                                    }
                                    alt={
                                        venue.media[0]?.alt ||
                                        "Missing image alt text"
                                    }
                                    className="w-full h-40 object-cover rounded"
                                />
                            </Link>
                            <Link
                                to={`/venue/${venue.id}`}
                                className="font-bold text-white"
                            >
                                {venue.name}
                            </Link>
                            {console.log(venue)}
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
        </>
    );
}

export default App;
