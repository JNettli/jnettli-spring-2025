import { Link, useLocation } from "react-router-dom";
import { useVenueStore } from "../useVenueStore";
import { isLoggedIn } from "./functions";
import { useState } from "react";
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

    return (
        <>
            <header className="flex justify-between items-center px-6 md:px-16 py-5 border-b border-b-slate-900/50 relative">
                <div className="flex">
                    <Link
                        to="/"
                        onClick={handleReset}
                        className="flex items-center"
                        title="Holidaze Home Page"
                    >
                        <img
                            src="/img/holidaze.svg"
                            alt="Holidaze Logo"
                            className="h-10"
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
                            src="/img/search.svg"
                            className="h-10 w-10 bg-[#088D9A] py-2 rounded-4xl hover:cursor-pointer"
                            title="Search for venues!"
                        />
                    </button>
                </div>
                <div className="flex gap-8">
                    {loggedIn && (
                        <Link to={profileId}>
                            <img
                                src={
                                    localStorage.getItem("userImage") ||
                                    "/img/profile.svg"
                                }
                                alt="Profile"
                                className="h-10 w-10 rounded-full mt-0.5 outline-[#088D9A] hover:outline-2"
                                title={`${localStorage.getItem(
                                    "userName"
                                )}'s Profile`}
                            />
                        </Link>
                    )}
                    <LoginModal />
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-6 w-[300px]">
                        <SearchBar />
                    </div>
                </div>
            </header>
            <div
                className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
                    mobileSearch ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                } bg-white px-6`}
            >
                <div className="py-2">
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
