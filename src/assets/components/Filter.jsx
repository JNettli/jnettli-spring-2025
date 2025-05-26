import { useState } from "react";
import FilterSliders from "./RangeSliders";

const FILTER_OPTIONS = ["wifi", "parking", "pets", "breakfast"];

const neutralCheck = (
    <img src="/img/neutral.svg" alt="neutral check" className="w-5 h-5" />
);
const positiveCheck = (
    <img src="/img/positive.svg" alt="positive check" className="w-5 h-5" />
);
const negativeCheck = (
    <img src="/img/negative.svg" alt="negative check" className="w-5 h-5" />
);

const getLabel = (value) => {
    if (value === true) return positiveCheck;
    if (value === false) return negativeCheck;
    return neutralCheck;
};

const getNextState = (current) => {
    if (current === true) return false;
    if (current === false) return undefined;
    return true;
};

export default function Filter({ filters, onFilterChange, onApply, onReset }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleFilters = () => {
        setIsOpen(!isOpen);
    };

    const handleToggle = (key) => {
        const nextValue = getNextState(filters[key]);
        const updated = { ...filters, [key]: nextValue };
        onFilterChange(updated);
    };

    return (
        <>
            <div
                className={`transition-all duration-700 overflow-hidden ${
                    isOpen
                        ? "lg:max-h-[450px] max-h-[670px] opacity-100 bg-slate-50"
                        : "max-h-0 opacity-0"
                }`}
            >
                <div className="p-4 flex flex-col justify-center gap-4 lg:max-w-5xl max-w-md mx-auto">
                    <div>
                        <h2 className="font-semibold mb-2">Guests & Price</h2>
                        <div className="flex flex-col">
                            <FilterSliders
                                filters={filters}
                                onFilterChange={onFilterChange}
                            />
                        </div>
                    </div>
                    <div className="border-b-slate-900/20 border-b w-9/10 mx-auto my-2"></div>
                    <div className="flex lg:flex-row lg:mx-0 flex-col w-full justify-around mx-auto">
                        <div>
                            <h2 className="font-semibold mb-2">Amenities</h2>
                            <div className="flex lg:flex-row flex-col gap-2">
                                {FILTER_OPTIONS.map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => handleToggle(key)}
                                        className="flex justify-between items-center gap-2 border border-gray-300 rounded px-3 py-2 hover:bg-gray-100 transition cursor-pointer"
                                        aria-label="Filters"
                                    >
                                        <span className="capitalize">
                                            {key}
                                        </span>
                                        <span>{getLabel(filters[key])}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-4 lg:w-1/2 w-full">
                            <div className="flex flex-col w-full">
                                <h2 className="font-semibold mb-2">Sort By</h2>
                                <select
                                    value={filters.sortBy || ""}
                                    onChange={(e) =>
                                        onFilterChange({
                                            ...filters,
                                            sortBy: e.target.value || undefined,
                                        })
                                    }
                                    className="border p-2 rounded w-full border-[#088D9A] focus:outline-[#088D9A] cursor-pointer"
                                >
                                    <option value="">Choose Option</option>
                                    <option value="rating">Rating</option>
                                    <option value="created">
                                        Creation Date
                                    </option>
                                    <option value="updated">
                                        Updated Date
                                    </option>
                                    <option value="popularity">
                                        Popularity
                                    </option>
                                </select>
                            </div>
                            <div className="w-full">
                                <h2 className="font-semibold mb-2">
                                    Sort Order
                                </h2>
                                <select
                                    value={filters.sortOrder || "desc"}
                                    onChange={(e) =>
                                        onFilterChange({
                                            ...filters,
                                            sortOrder: e.target.value,
                                        })
                                    }
                                    className="border p-2 rounded w-full border-[#088D9A] focus:outline-[#088D9A] cursor-pointer"
                                >
                                    <option value="desc">Descending</option>
                                    <option value="asc">Ascending</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 justify-center p-4">
                    <button
                        onClick={() => {
                            onApply?.();
                            setIsOpen(false);
                        }}
                        className="bg-[#088D9A] text-white px-4 py-2 rounded hover:bg-[#077d89] cursor-pointer transition duration-150"
                        aria-label="Click to apply filters"
                    >
                        Apply Filters
                    </button>
                    <button
                        onClick={() => {
                            onReset?.();
                            setIsOpen(false);
                        }}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer transition duration-150"
                        aria-label="Click to clear filters"
                    >
                        Clear Filters
                    </button>
                </div>
                <div className="border-b-slate-900/20 border-b w-5xl mx-auto"></div>
            </div>

            <div className="px-4 pt-4 bg-slate-50 w-full items-center flex flex-col">
                <button
                    onClick={toggleFilters}
                    className="bg-[#088D9A] text-white px-4 w-32 py-2 rounded hover:bg-[#077d89] cursor-pointer transition duration-150"
                    aria-label="Click to show/hide filters"
                >
                    {isOpen ? "Hide Filters" : "Show Filters"}
                </button>
            </div>
        </>
    );
}
