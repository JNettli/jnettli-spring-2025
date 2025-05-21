import { Link, useLocation } from "react-router-dom";
import { useVenueStore } from "../useVenueStore";
import { isLoggedIn } from "./functions";
import { useEffect, useRef, useState } from "react";
import LoginModal from "./LoginModal";
import SearchBar from "./Search";
import Filter from "./Filter";

function Header() {
    const [mobileSearch, setMobileSearch] = useState(false);
    const loggedIn = isLoggedIn();
    const profileId = "/profile/" + localStorage.getItem("userName");
    const {
        setSearchQuery,
        setIsSearchMode,
        resetFilters,
        pendingFilters,
        setPendingFilters,
        applyFilters,
    } = useVenueStore();

    const location = useLocation();
    const isHome = location.pathname === "/";

    const handleReset = () => {
        setSearchQuery("");
        setIsSearchMode(false);
        resetFilters();
    };

    const searchInputRef = useRef(null);

    useEffect(() => {
        if (mobileSearch && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [mobileSearch]);

    return (
        <>
            <header className="flex justify-between items-center px-6 md:px-16 py-5 border-b border-b-slate-900/50 relative">
                <div className="flex flex-shrink-0 w-40 md:justify-baseline justify-around">
                    <Link
                        to="/"
                        onClick={handleReset}
                        className="flex items-center"
                        title="Holidaze Home Page"
                    >
                        <img
                            src="/img/holidaze.svg"
                            alt="Holidaze Logo"
                            className="w-11"
                        />
                        <p className="text-[#088D9A] ml-2 text-xl font-bold logo hidden md:block">
                            Holidaze
                        </p>
                    </Link>
                    <button
                        className="md:hidden ml-8"
                        onClick={() => setMobileSearch((prev) => !prev)}
                    >
                        <img
                            src={
                                mobileSearch
                                    ? "/img/negative.svg"
                                    : "/img/search.svg"
                            }
                            className={`h-11 w-11 rounded-4xl hover:cursor-pointer ${
                                mobileSearch ? "bg-white" : "py-2 bg-[#088D9A]"
                            }`}
                            title={
                                mobileSearch
                                    ? "Remove searchbar"
                                    : "Search for venues!"
                            }
                        />
                    </button>
                </div>
                <div className="hidden md:block relative w-full lg:max-w-5xl px-4 z-50">
                    <SearchBar />
                </div>
                <div className="flex flex-shrink-0 justify-around w-40">
                    {loggedIn && (
                        <Link to={profileId}>
                            <img
                                src={
                                    localStorage.getItem("userImage") ||
                                    "/img/profile.svg"
                                }
                                alt="Profile"
                                className="h-11 w-11 rounded-full mt-0.5 border-[#088D9A] hover:border-2"
                                title={`${localStorage.getItem(
                                    "userName"
                                )}'s Profile`}
                            />
                        </Link>
                    )}
                    <div className="w-11 h-11">
                        <LoginModal />
                    </div>
                </div>
            </header>
            <div
                className={`md:hidden transition-all duration-300 ease-in-out ${
                    mobileSearch ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                } bg-white px-6`}
            >
                <div className="py-4">
                    <SearchBar />
                </div>
            </div>
            {isHome && (
                <Filter
                    filters={pendingFilters}
                    onFilterChange={setPendingFilters}
                    onApply={applyFilters}
                    onReset={() => {
                        resetFilters();
                        setPendingFilters({});
                    }}
                />
            )}
        </>
    );
}

export { Header };
