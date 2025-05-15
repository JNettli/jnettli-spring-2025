import { useState } from "react";
import FilterSliders from "./RangeSliders";

const FILTER_OPTIONS = ["wifi", "parking", "pets", "breakfast"];

const getNextState = (current) => {
    if (current === true) return false;
    if (current === false) return undefined;
    return true;
};

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

export default function Filter({ filters, onFilterChange, onApply, onReset }) {
    const [localFilters, setLocalFilters] = useState(filters);
    const [isOpen, setIsOpen] = useState(false);

    const toggleFilters = () => {
        setIsOpen(!isOpen);
    };

    const handleToggle = (key) => {
        const nextValue = getNextState(localFilters[key]);
        const updated = { ...localFilters, [key]: nextValue };
        setLocalFilters(updated);
        onFilterChange(updated);
    };

    return (
        <>
            <div
                className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="p-4 flex flex-col justify-center gap-4 max-w-5xl mx-auto">
                    <div className="flex justify-around">
                        <div>
                            <h2 className="font-semibold mb-2">Amenities</h2>
                            <div className="flex gap-2">
                                {FILTER_OPTIONS.map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => handleToggle(key)}
                                        className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 hover:bg-gray-100 transition"
                                    >
                                        <span className="capitalize">
                                            {key}
                                        </span>
                                        <span>{getLabel(filters[key])}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col w-1/2">
                            <h2 className="font-semibold mb-2">Sort By</h2>
                            <select
                                value={filters.sortBy || ""}
                                onChange={(e) =>
                                    onFilterChange({
                                        ...filters,
                                        sortBy: e.target.value || undefined,
                                    })
                                }
                                className="border p-2 rounded w-full"
                            >
                                <option value="">Choose Option</option>
                                <option value="rating">Rating</option>
                                <option value="created">Creation Date</option>
                                <option value="updated">Updated Date</option>
                                <option value="popularity">Popularity</option>
                            </select>
                        </div>
                    </div>
                    <div className="border-b-slate-900/20 border-b w-9/10 mx-auto mt-8"></div>
                    <div>
                        <h2 className="font-semibold mb-2">Guests & Price</h2>
                        <div className="flex flex-col">
                            <FilterSliders
                                filters={filters}
                                onFilterChange={onFilterChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 justify-center p-4">
                    <button
                        onClick={() => {
                            onApply?.();
                            setIsOpen(false);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Apply Filters
                    </button>
                    <button
                        onClick={() => {
                            onReset?.();
                            setIsOpen(false);
                        }}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                    >
                        Clear Filters
                    </button>
                </div>
                <div className="border-b-slate-900/20 border-b w-5xl mx-auto"></div>
            </div>

            <div className="px-4 pt-4 mx-auto">
                <button
                    onClick={toggleFilters}
                    className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 transition"
                >
                    {isOpen ? "Hide Filters" : "Show Filters"}
                </button>
            </div>
        </>
    );
}
