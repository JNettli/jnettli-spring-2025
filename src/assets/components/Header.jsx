import { Link, useLocation } from "react-router-dom";
import { useVenueStore } from "../useVenueStore";
import { isLoggedIn } from "./functions";
import { useState } from "react";
import LoginModal from "./LoginModal";
import SearchBar from "./Search";
import Filter from "./Filter";
import { logout } from "../auth";
import { toast, ToastContainer } from "react-toastify";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const loggedIn = isLoggedIn();
    const [showLoginModal, setShowLoginModal] = useState(false);
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
            <ToastContainer position="top-center" autoClose={3000} />
            <header className="flex w-full justify-between items-center px-6 md:px-16 py-5 border-b border-b-slate-900/50 bg-slate-50 relative z-50">
                <div className="flex flex-shrink-0 w-40">
                    <Link
                        to="/"
                        onClick={handleReset}
                        className="flex items-center"
                        title="Holidaze Home Page"
                    >
                        <img
                            src="/img/holidaze.svg"
                            alt="Holidaze Logo"
                            className="w-11 h-9 -mr-2"
                        />
                        <p className="text-[#088D9A] ml-2 text-xl font-bold logo">
                            Holidaze
                        </p>
                    </Link>
                </div>

                <div className="hidden md:block relative w-full lg:max-w-5xl px-4 z-50">
                    <SearchBar />
                </div>

                <div className="flex flex-shrink-0 gap-8 -mt-1 justify-end md:w-40 w-fit">
                    {loggedIn && (
                        <Link to={profileId}>
                            <img
                                src={
                                    localStorage.getItem("userImage") ||
                                    "/img/profile.svg"
                                }
                                alt="Profile"
                                className="h-11 w-11 rounded-full mt-0.5 object-cover outline-[#088D9A] hover:outline-2 md:block hidden"
                                title={`${localStorage.getItem(
                                    "userName"
                                )}'s Profile`}
                            />
                        </Link>
                    )}

                    {!loggedIn && (
                        <div className="w-11 h-11 md:block hidden">
                            <button
                                onClick={() => setShowLoginModal(true)}
                                aria-label="Open Login"
                            >
                                <img
                                    src="/img/login.svg"
                                    alt="Login"
                                    className="h-11 w-11 mt-1 cursor-pointer"
                                    title="Login"
                                />
                            </button>
                        </div>
                    )}
                    {loggedIn ? (
                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                toast.success(
                                    "You have logged out successfully!"
                                );
                                logout();
                            }}
                            className="cursor-pointer md:flex hidden"
                            aria-label="Click to Log out"
                        >
                            <img
                                src="/img/logout.svg"
                                alt="Logout"
                                className="h-11 w-11 mt-1"
                                title="Logout"
                            />
                        </button>
                    ) : (
                        ""
                    )}

                    <button
                        className="md:hidden ml-4"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Opens sidebar menu on mobile"
                    >
                        <img
                            src="/img/hamburger.svg"
                            alt="Menu"
                            className="h-10 py-2 cursor-pointer"
                        />
                    </button>
                </div>
            </header>

            <div
                className={`fixed inset-0 z-50 ${
                    menuOpen ? "block" : "pointer-events-none"
                }`}
            >
                <div
                    className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                        menuOpen ? "opacity-50" : "opacity-0"
                    }`}
                    onClick={() => setMenuOpen(false)}
                />

                <div
                    className={`fixed right-0 top-0 h-full w-2/3 max-w-sm bg-slate-50 shadow-lg flex flex-col gap-4 z-50 transform transition-transform duration-300 ease-in-out ${
                        menuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    <button
                        onClick={() => setMenuOpen(false)}
                        className={`relative -left-10 top-0 bg-slate-50 text-red-600 hover:text-red-800 hover:shadow-lg transition duration-150 cursor-pointer h-10 w-10 text-2xl font-black z-50 rounded-bl-lg -mb-10 ${
                            !menuOpen ? "opacity-0" : "opacity-100"
                        }`}
                        aria-label="Close sidebar menu"
                    >
                        ✕
                    </button>

                    <div className="px-2">
                        <SearchBar />
                    </div>

                    {loggedIn && (
                        <div className="flex items-center gap-4 bg-white shadow-md hover:shadow-lg cursor-pointer">
                            <Link
                                to={profileId}
                                className="flex items-center w-full gap-2"
                                onClick={() => setMenuOpen(false)}
                            >
                                <img
                                    src={
                                        localStorage.getItem("userImage") ||
                                        "/img/profile.svg"
                                    }
                                    alt="Profile"
                                    className="h-16 w-16 object-cover"
                                />
                                <p className="logo text-xl font-semibold text-[#088D9A] py-4 pr-4 hover:translate-x-2 transition duration-150 w-full">
                                    {localStorage.getItem("userName") ||
                                        "Holidaze User"}
                                    's Profile
                                </p>
                            </Link>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            if (loggedIn) {
                                setMenuOpen(false);
                                logout();
                            } else {
                                setShowLoginModal(true);
                                setMenuOpen(false);
                            }
                        }}
                        className="flex cursor-pointer bg-white shadow-md w-full hover:shadow-lg transition duration-150"
                        aria-label="Click to Login/Logout"
                    >
                        <img
                            src={
                                loggedIn ? "/img/logout.svg" : "/img/login.svg"
                            }
                            alt={loggedIn ? "Logout" : "Login"}
                            className="h-10 my-2 ml-4"
                        />
                        <p className="flex text-2xl pl-4 text-[#088D9A] logo items-center hover:translate-x-2 transition duration-150 h-full w-full">
                            {loggedIn ? "Logout" : "Login"}
                        </p>
                    </button>
                </div>
            </div>
            {showLoginModal && (
                <LoginModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                />
            )}

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
