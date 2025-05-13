import { useState } from "react";

const FILTER_OPTIONS = ["wifi", "parking", "pets", "breakfast"];

const getNextState = (current) => {
    if (current === true) return false;
    if (current === false) return undefined;
    return true;
};

const getLabel = (value) => {
    if (value === true) return "✅";
    if (value === false) return "❌";
    return "⚪";
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
            <div className="px-4 pt-4 mx-auto">
                <button
                    onClick={toggleFilters}
                    className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 transition"
                >
                    {isOpen ? "Hide Filters" : "Show Filters"}
                </button>
            </div>

            <div
                className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="p-4 flex flex-col md:flex-row justify-center gap-4">
                    <div>
                        <h2 className="font-semibold mb-2">Amenities</h2>
                        <div className="flex flex-col md:flex-row gap-2">
                            {FILTER_OPTIONS.map((key) => (
                                <button
                                    key={key}
                                    onClick={() => handleToggle(key)}
                                    className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 hover:bg-gray-100 transition"
                                >
                                    <span className="capitalize">{key}</span>
                                    <span>{getLabel(filters[key])}</span>
                                </button>
                            ))}
                        </div>
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

                    <div>
                        <h2 className="font-semibold mb-2">Guests & Price</h2>
                        <div className="flex flex-col">
                            <div>
                                <label className="block font-medium">
                                    Max Price: {filters.maxPrice ?? "Any"}
                                </label>
                                <input
                                    type="range"
                                    min={1}
                                    max={10000}
                                    value={filters.maxPrice || 1}
                                    onChange={(e) =>
                                        onFilterChange({
                                            ...filters,
                                            maxPrice: Number(e.target.value),
                                        })
                                    }
                                    className="w-full"
                                />
                                <input
                                    type="number"
                                    min={0}
                                    max={10000}
                                    value={filters.maxPrice || ""}
                                    onChange={(e) =>
                                        onFilterChange({
                                            ...filters,
                                            maxPrice: e.target.value
                                                ? Number(e.target.value)
                                                : undefined,
                                        })
                                    }
                                    className="mt-1 p-1 border rounded w-full"
                                    placeholder="Enter price manually"
                                />
                                <label className="block font-medium">
                                    Guests: {filters.maxGuests ?? "Any"}
                                </label>
                                <input
                                    type="range"
                                    min={1}
                                    max={100}
                                    value={filters.maxGuests || 1}
                                    onChange={(e) =>
                                        onFilterChange({
                                            ...filters,
                                            maxGuests: Number(e.target.value),
                                        })
                                    }
                                    className="w-full"
                                />
                                <input
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={filters.maxGuests || ""}
                                    onChange={(e) =>
                                        onFilterChange({
                                            ...filters,
                                            maxGuests: e.target.value
                                                ? Number(e.target.value)
                                                : undefined,
                                        })
                                    }
                                    className="mt-1 p-1 border rounded w-full"
                                    placeholder="Enter guests manually"
                                />
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
            </div>
        </>
    );
}
