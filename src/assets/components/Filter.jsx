import { useState } from "react";

export default function Filter({ onFilterChange }) {
    const [filters, setFilters] = useState({
        wifi: false,
        parking: false,
        pets: false,
        breakfast: false,
    });

    const handleChange = (e) => {
        const { name, checked } = e.target;
        const newFilters = { ...filters, [name]: checked };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div className="flex gap-4 mb-4 flex-wrap">
            {["wifi", "parking", "pets", "breakfast"].map((filter) => (
                <label key={filter} className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name={filter}
                        checked={filters[filter]}
                        onChange={handleChange}
                        className="accent-[#007A8D]"
                    />
                    <span className="capitalize">{filter}</span>
                </label>
            ))}
        </div>
    );
}
