import { useVenueStore } from "../useVenueStore";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function SearchBar() {
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);

    const { venues, setSearchQuery, setIsSearchMode } = useVenueStore();
    const navigate = useNavigate();
    const inputRef = useRef();

    const handleSearch = (e) => {
        e.preventDefault();
        if (input.trim() === "") return;
        if (highlightIndex >= 0 && suggestions[highlightIndex]) {
            handleSelectSuggestion(suggestions[highlightIndex].id);
        } else {
            setSearchQuery(input.trim());
            setIsSearchMode(true);
            navigate({
                pathname: "/",
                search: createSearchParams({ q: input.trim() }).toString(),
            });
        }
        setShowDropdown(false);
    };

    const handleSelectSuggestion = (venueId) => {
        setInput("");
        setShowDropdown(false);
        navigate(`/venue/${venueId}`);
    };

    useEffect(() => {
        if (input.trim().length === 0) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        const lower = input.toLowerCase();
        const matches = venues
            .filter((v) => v.name.toLowerCase().includes(lower))
            .slice(0, 20);

        setSuggestions(matches);
        setShowDropdown(matches.length > 0);
        setHighlightIndex(-1);
    }, [input, venues]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (inputRef.current && !inputRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleKeyDown = (e) => {
        if (!showDropdown || suggestions.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightIndex((prev) =>
                prev < suggestions.length - 1 ? prev + 1 : 0
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIndex((prev) =>
                prev > 0 ? prev - 1 : suggestions.length - 1
            );
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (highlightIndex >= 0 && suggestions[highlightIndex]) {
                handleSelectSuggestion(suggestions[highlightIndex].id);
            } else {
                handleSearch(e);
            }
        }
    };

    return (
        <div className="relative w-full max-w-md mx-auto" ref={inputRef}>
            <form
                onSubmit={handleSearch}
                onKeyDown={handleKeyDown}
                className="flex justify-between z-50"
            >
                <input
                    type="text"
                    placeholder="Search venues..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="border border-slate-900/50 rounded-tl-4xl rounded-bl-4xl pl-4 py-1 ml-2 w-full"
                />
                <button type="submit" className="mr-2">
                    <img
                        src="/img/search.svg"
                        alt="Search Icon"
                        className="bg-[#088D9A] p-2 h-10 w-14 rounded-tr-4xl rounded-br-4xl cursor-pointer"
                    />
                </button>
            </form>
            {showDropdown && (
                <>
                    <div className="bg-white border border-slate-900/50 border-b-0 w-full h-14 -mt-12 rounded-t-3xl"></div>
                    <ul className="absolute top-full w-full max-h-80 overflow-y-auto bg-white border border-slate-900/50 border-t-0 rounded-b-xl shadow z-40">
                        {suggestions.map((venue, index) => (
                            <div key={venue.id}>
                                <div className="border-t-1 w-9/10 mx-auto border-slate-900/20"></div>
                                <li
                                    ref={(element) => {
                                        if (
                                            index === highlightIndex &&
                                            element
                                        ) {
                                            element.scrollIntoView({
                                                behavior: "smooth",
                                                block: "nearest",
                                            });
                                        }
                                    }}
                                    onClick={() =>
                                        handleSelectSuggestion(venue.id)
                                    }
                                    className={`py-2 px-4 cursor-pointer overflow-x-hidden ${
                                        index === highlightIndex
                                            ? "bg-[#088D9A] text-white"
                                            : "hover:bg-[#088D9A] hover:text-white"
                                    }`}
                                >
                                    <div className="flex justify-between">
                                        <div className="flex flex-col my-auto">
                                            <span className="font-semibold text-base">
                                                {venue.name}
                                            </span>
                                            <span className="text-sm font-semibold text-slate-900/50">
                                                {venue.location?.country || ""}
                                                {venue.location?.country !==
                                                    null &&
                                                venue.location?.country !== ""
                                                    ? ", "
                                                    : "No location set"}
                                                {venue.location?.city || ""}
                                            </span>
                                        </div>
                                        <img
                                            src={
                                                venue.media?.[0]?.url ||
                                                "/img/error-image.svg"
                                            }
                                            alt={
                                                venue.media?.[0]?.alt ||
                                                "Venue preview"
                                            }
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                    </div>
                                </li>
                            </div>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
