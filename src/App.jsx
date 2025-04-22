import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { APIVenues } from "./assets/Constants";
import Filter from "./assets/components/Filter";

function App() {
    const [venues, setVenues] = useState([]);
    const [totalVenues, setTotalVenues] = useState(0);

    const [searchParams, setSearchParams] = useSearchParams();
    const defaultFilters = {
        wifi: undefined,
        parking: undefined,
        pets: undefined,
        breakfast: undefined,
    };

    const [filters, setFilters] = useState(() => {
        const urlFilters = {};
        for (const key of Object.keys(defaultFilters)) {
            const value = searchParams.get(key);
            if (value === "true") urlFilters[key] = true;
            else if (value === "false") urlFilters[key] = false;
            else urlFilters[key] = undefined;
        }
        return urlFilters;
    });

    const [pendingFilters, setPendingFilters] = useState(filters);

    const currentPage = parseInt(searchParams.get("page")) || 1;
    const venuesPerPage = 25;
    const totalPages = Math.ceil(totalVenues / venuesPerPage);

    useEffect(() => {
        async function getVenues() {
            try {
                const filterQuery = Object.entries(filters)
                    .filter(([, value]) => value !== undefined)
                    .map(([key, value]) => `meta.${key}=${value}`)
                    .join("&");

                const sortField = "rating";
                const sortOrder = "desc";

                const res = await fetch(
                    APIVenues +
                        "?_owner=true&_bookings=true&limit=" +
                        venuesPerPage +
                        "&page=" +
                        currentPage +
                        "&sort=" +
                        sortField +
                        "&sortOrder=" +
                        sortOrder +
                        (filterQuery ? `&${filterQuery}` : "")
                );
                console.log(res.url);
                const data = await res.json();
                setVenues(data.data);
                setTotalVenues(data.meta?.totalCount || 0);
            } catch (error) {
                console.error("Error fetching venues:", error);
            }
        }
        getVenues();
    }, [currentPage, filters]);

    useEffect(() => {
        const newParams = new URLSearchParams(searchParams.toString());

        Object.entries(filters).forEach(([key, value]) => {
            if (value === true) newParams.set(key, "true");
            else if (value === false) newParams.set(key, "false");
            else newParams.delete(key);
        });

        newParams.set("page", currentPage.toString());
        setSearchParams(newParams);
    }, [filters, currentPage, searchParams, setSearchParams]);

    const renderPageButtons = () => {
        const pageButtons = [];
        const range = 2;

        for (let page = 1; page <= totalPages; page++) {
            const isFirst = page === 1;
            const isLast = page === totalPages;
            const isInRange = Math.abs(page - currentPage) <= range;

            if (isFirst || isLast || isInRange) {
                pageButtons.push(
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded ${
                            page === currentPage
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 hover:bg-blue-100"
                        }`}
                    >
                        {page}
                    </button>
                );
            } else if (
                (page === 2 && currentPage > range + 2) ||
                (page === totalPages - 1 &&
                    currentPage < totalPages - range - 1) ||
                Math.abs(page - currentPage) === range + 1
            ) {
                if (pageButtons[pageButtons.length - 1]?.type !== "span") {
                    pageButtons.push(
                        <span key={`ellipsis-${page}`} className="px-2">
                            ...
                        </span>
                    );
                }
            }
        }

        return pageButtons;
    };

    const handlePageChange = (page) => {
        setSearchParams({ page: page.toString() });
    };

    return (
        <>
            <Filter
                filters={pendingFilters}
                onFilterChange={setPendingFilters}
            />
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                onClick={() => {
                    setFilters(pendingFilters);
                }}
            >
                Apply Filters
            </button>
            <button
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition duration-150"
                onClick={() => setPendingFilters(defaultFilters)}
            >
                Clear All Filters
            </button>
            <div className="max-w-7xl mx-auto p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {venues.map((venue) => (
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
                                        "Missing image alt text. Please let the venue owner know!"
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
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-center mt-6 gap-2 flex-wrap">
                {renderPageButtons()}
            </div>
        </>
    );
}

export default App;
