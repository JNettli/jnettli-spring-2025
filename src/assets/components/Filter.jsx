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

export default function Filter({ filters, onFilterChange }) {
    const handleToggle = (key) => {
        const nextValue = getNextState(filters[key]);
        onFilterChange({
            ...filters,
            [key]: nextValue,
        });
    };

    return (
        <div className="flex flex-wrap gap-4 p-4">
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
    );
}
