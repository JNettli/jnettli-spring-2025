import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { APIVenues } from "./assets/Constants";
import { useVenueStore } from "./assets/useVenueStore";
import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet-async";

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
        setSearchQuery,
        setIsSearchMode,
        filters,
    } = useVenueStore();

    const [filteredVenues, setFilteredVenues] = useState([]);
    const [displayedVenues, setDisplayedVenues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [scrollTop, setScrollTop] = useState(false);
    const [searchParams] = useSearchParams();

    const limit = 100;

    const urlQuery = searchParams.get("q");

    useEffect(() => {
        if (urlQuery) {
            setSearchQuery(urlQuery);
            setIsSearchMode(true);
        }
    }, [urlQuery, setSearchQuery, setIsSearchMode]);

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
        if (isLoaded) return;

        let currentPage = 2;
        let allFetched = [...venues];

        try {
            while (true) {
                const res = await fetch(
                    `${APIVenues}?_owner=true&_bookings=true&limit=${limit}&page=${currentPage}`
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
            toast.error("Error loading full venue list");
        }
    }, [venues, setVenues, isLoaded, setIsLoaded]);

    const applyFiltersToVenues = useCallback(() => {
        let filtered = [...venues];

        if (isSearchMode && searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            filtered = venues.filter((venue) => {
                return (
                    venue.name.toLowerCase().includes(query) ||
                    venue.location?.city?.toLowerCase().includes(query) ||
                    venue.location?.country?.toLowerCase().includes(query)
                );
            });
        } else {
            filtered = venues.filter((venue) => {
                if (
                    filters.wifi !== undefined &&
                    venue.meta?.wifi !== filters.wifi
                )
                    return false;
                if (
                    filters.parking !== undefined &&
                    venue.meta?.parking !== filters.parking
                )
                    return false;
                if (
                    filters.pets !== undefined &&
                    venue.meta?.pets !== filters.pets
                )
                    return false;
                if (
                    filters.breakfast !== undefined &&
                    venue.meta?.breakfast !== filters.breakfast
                )
                    return false;
                if (
                    filters.minPrice !== undefined &&
                    venue.price < filters.minPrice
                )
                    return false;
                if (
                    filters.maxPrice !== undefined &&
                    venue.price > filters.maxPrice
                )
                    return false;
                if (
                    filters.maxGuests !== undefined &&
                    venue.maxGuests > filters.maxGuests
                )
                    return false;
                return true;
            });
        }

        if (filters.sortBy === "rating") {
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (filters.sortBy === "created") {
            filtered.sort((a, b) => new Date(b.created) - new Date(a.created));
        } else if (filters.sortBy === "updated") {
            filtered.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        } else if (filters.sortBy === "popularity") {
            filtered.sort(
                (a, b) => (b._count?.bookings || 0) - (a._count?.bookings || 0)
            );
        }

        const uniqueFiltered = Array.from(
            new Map(filtered.map((v) => [v.id, v])).values()
        );

        setFilteredVenues(uniqueFiltered);
        if (isSearchMode) {
            setDisplayedVenues(filtered);
            setHasMore(false);
        } else {
            setDisplayedVenues(filtered.slice(0, limit));
            setHasMore(filtered.length > limit);
        }
        setPage(1);
    }, [venues, filters, isSearchMode, searchQuery]);

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
        if (!isLoaded) return;
        if (isSearchMode && searchQuery) {
            const results = searchVenues(searchQuery);
            setFilteredVenues(results);
            setDisplayedVenues(results.slice(0, limit));
            setPage(1);
            setHasMore(results.length > limit);
        } else {
            applyFiltersToVenues();
        }
    }, [
        isLoaded,
        isSearchMode,
        searchQuery,
        venues,
        applyFiltersToVenues,
        searchVenues,
    ]);

    useEffect(() => {
        if (inView && hasMore && !loading) {
            loadMoreVenues();
        }
    }, [inView, hasMore, loading, loadMoreVenues]);

    const refreshVenueStore = useVenueStore((state) => state.refreshVenueStore);
    useEffect(() => {
        const intervalId = setInterval(async () => {
            if (document.visibilityState === "visible") {
                console.log("Auto-refreshing venue data..."); // Please don't dock me for this console log :) I like to see when this happens <3
                await refreshVenueStore();
            }
        }, 120000);

        return () => clearInterval(intervalId);
    }, [refreshVenueStore]);
    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content="Browse amazing venues around the world. Find your next adventure, getaway, or relaxing stay."
                />
                <meta
                    name="keywords"
                    content="travel, venues, booking, adventure, getaway, vacation, holiday, Holidaze"
                />
                <meta name="author" content="JNettli" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta
                    property="og:title"
                    content="Holidaze – Browse All Venues"
                />
                <meta
                    property="og:description"
                    content="Discover a wide variety of vacation venues from around the globe. Book your dream stay with Holidaze."
                />
                <meta property="og:image" content={"/img/holidaze.svg"} />
            </Helmet>
            <div className="max-w-7xl mx-auto p-4">
                <ToastContainer position="top-center" autoClose={3000} />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {displayedVenues.map((venue) => (
                        <Link
                            key={venue.id}
                            to={`/venue/${venue.id}`}
                            className="bg-white shadow hover:shadow-lg transition duration-150 rounded-lg truncate"
                            aria-label="Go to this venue"
                        >
                            <div>
                                <img
                                    src={
                                        venue.media[0]?.url ||
                                        "/img/error-image.png"
                                    }
                                    alt={venue.media[0]?.alt || "Missing alt"}
                                    className="w-full h-40 object-cover rounded-t mb-1"
                                    onError={(e) =>
                                        (e.target.src = "img/error-image.png")
                                    }
                                />
                            </div>
                            <div>
                                <p className="font-bold text-[#088D9A] px-2 truncate">
                                    {venue.name}
                                </p>
                            </div>

                            <p className="text-slate-500 text-sm px-2 truncate">
                                {venue.location?.city},{" "}
                                {venue.location?.country}
                            </p>
                            <div className="flex justify-between px-2 items-center">
                                <div className="flex items-center gap-1">
                                    <p
                                        className="text-slate-700 font-bold"
                                        title="Venue Rating"
                                    >
                                        {venue.rating}{" "}
                                    </p>
                                    <img
                                        src="/img/rating.svg"
                                        alt="Rating star"
                                        className="h-4 w-4 inline"
                                    />
                                </div>
                                <div className="flex">
                                    <p className="text-slate-700 font-bold">
                                        $ {venue.price} /
                                    </p>
                                    <p className="text-sm font-semibold text-slate-500 my-auto ml-1">
                                        Night
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-center gap-4 w-3/5 mx-auto border-t border-t-slate-900/20 p-2 relative">
                                <div>
                                    {venue.meta.wifi ? (
                                        <img
                                            src="/img/wifi.svg"
                                            alt="wifi icon"
                                            className="h-4 opacity-80"
                                            title="Wifi available!"
                                        />
                                    ) : (
                                        <>
                                            <img
                                                src="/img/nowifi.svg"
                                                alt="wifi icon"
                                                className="h-4"
                                                title="Wifi available!"
                                            />
                                        </>
                                    )}
                                </div>
                                <div>
                                    {venue.meta.parking ? (
                                        <img
                                            src="/img/parking.svg"
                                            alt="parking icon"
                                            className="h-4 opacity-80"
                                            title="Parking available!"
                                        />
                                    ) : (
                                        <img
                                            src="/img/noparking.svg"
                                            alt="parking icon"
                                            className="h-4"
                                            title="Parking available!"
                                        />
                                    )}
                                </div>
                                <div>
                                    {venue.meta.pets ? (
                                        <img
                                            src="/img/pets.svg"
                                            alt="pets icon"
                                            className="h-4 opacity-80"
                                            title="Pets welcome!"
                                        />
                                    ) : (
                                        <>
                                            <img
                                                src="/img/nopets.svg"
                                                alt="pets icon"
                                                className="h-4"
                                                title="Pets welcome!"
                                            />
                                        </>
                                    )}
                                </div>
                                <div>
                                    {venue.meta.breakfast ? (
                                        <img
                                            src="/img/breakfast.svg"
                                            alt="breakfast icon"
                                            className="h-4 opacity-80"
                                            title="Breakfast available!"
                                        />
                                    ) : (
                                        <>
                                            <img
                                                src="/img/nobreakfast.svg"
                                                alt="breakfast icon"
                                                className="h-4"
                                                title="Breakfast available!"
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </Link>
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
                    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 text-3xl bg-white outline-[#007A8D] outline-2 rounded-full transition duration-150 hover:scale-110 cursor-pointer rotate-270"
                    aria-label="Back to top"
                >
                    <p className="mt-0.5 text-[#007A8D]">&#x279C;</p>
                </button>
            )}
        </>
    );
}

export default App;
