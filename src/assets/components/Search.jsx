import { useVenueStore } from "../useVenueStore";
import { createSearchParams, useNavigate } from "react-router-dom";
import {
    useState,
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from "react";
import debounce from "lodash.debounce";

const SearchBar = forwardRef((_, externalRef) => {
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);

    const { venues, setSearchQuery, setIsSearchMode } = useVenueStore();
    const navigate = useNavigate();

    const wrapperRef = useRef();
    const inputRef = useRef();
    const debouncedUpdateSuggestions = useRef();

    useImperativeHandle(externalRef, () => ({
        focus: () => inputRef.current?.focus(),
    }));

    if (!debouncedUpdateSuggestions.current) {
        debouncedUpdateSuggestions.current = debounce((value) => {
            const matches = venues.filter((v) =>
                v.name.toLowerCase().includes(value)
            );
            const sliced = matches.slice(0, 20);

            setSuggestions(sliced);
            setShowDropdown(sliced.length > 0);
            setHighlightIndex(-1);
        }, 150);
    }

    useEffect(() => {
        const trimmedInput = input.trim().toLowerCase();

        setSuggestions([]);
        setHighlightIndex(-1);

        if (trimmedInput === "") {
            debouncedUpdateSuggestions.current.cancel();
            return;
        }

        debouncedUpdateSuggestions.current(trimmedInput);

        return () => {
            debouncedUpdateSuggestions.current.cancel();
        };
    }, [input, venues]);

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
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
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
        <div className="w-full relative" ref={wrapperRef}>
            <form
                onSubmit={handleSearch}
                onKeyDown={handleKeyDown}
                className="flex justify-between"
            >
                <input
                    type="text"
                    ref={inputRef}
                    placeholder="Search venues..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="border border-slate-900/50 rounded-tl-4xl rounded-bl-4xl pl-4 py-1 ml-2 w-full focus:outline-none focus:border-[#088D9A]"
                />
                <button type="submit" className="mr-2">
                    <img
                        src="/img/search.svg"
                        alt="Search Icon"
                        className="bg-[#088D9A] p-2 h-10 w-14 rounded-tr-4xl rounded-br-4xl cursor-pointer hover:bg-[#066B7A] transition duration-150"
                    />
                </button>
            </form>

            {showDropdown && (
                <>
                    <div
                        className={`bg-white border border-slate-900/20 border-b-0 w-full h-14 -mt-12 -mb-2 rounded-t-3xl ${
                            suggestions.length == 0 ? "opacity-0" : ""
                        }`}
                    ></div>
                    <div
                        className={`
        absolute left-0 right-0 top-full w-full overflow-hidden transition-all duration-300 
        ${
            suggestions.length > 0
                ? "max-h-96 border border-slate-900/20 rounded-b-xl shadow z-[101] bg-white"
                : "max-h-0"
        }
    `}
                    >
                        <ul className="divide-y divide-slate-200">
                            {suggestions.map((venue, index) => (
                                <li
                                    key={venue.id}
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
                                    className={`py-2 px-4 cursor-pointer overflow-x-hidden transition-colors duration-150 ${
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
                                                {venue.location?.country
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
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
});

export default SearchBar;
