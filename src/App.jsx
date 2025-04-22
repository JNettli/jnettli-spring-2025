import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { APIVenues } from "./assets/Constants";
import Filter from "./assets/components/Filter";

function App() {
    const [venues, setVenues] = useState([]);
    const [totalVenues, setTotalVenues] = useState(0);

    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        wifi: false,
        parking: false,
        pets: false,
        breakfast: false,
    });

    const currentPage = parseInt(searchParams.get("page")) || 1;
    const venuesPerPage = 25;
    const totalPages = Math.ceil(totalVenues / venuesPerPage);

    useEffect(() => {
        async function getVenues() {
            try {
                const res = await fetch(
                    APIVenues +
                        "?_owner=true&_bookings=true&limit=" +
                        venuesPerPage +
                        "&page=" +
                        currentPage +
                        "&sort=rating" +
                        "&sortOrder=desc"
                );
                const data = await res.json();
                setVenues(data.data);
                setTotalVenues(data.meta?.totalCount || 0);
            } catch (error) {
                console.error("Error fetching venues:", error);
            }
        }
        getVenues();
    }, [currentPage]);

    const filteredVenues = venues.filter((venue) => {
        return Object.entries(filters).every(([key, value]) => {
            return !value || venue.meta?.[key];
        });
    });

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
            <Filter onFilterChange={setFilters} />
            <div className="max-w-7xl mx-auto p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredVenues.map((venue) => (
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
