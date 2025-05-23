import { Link } from "react-router-dom";
import { useVenueStore } from "../useVenueStore";

function Footer() {
    const { setSearchQuery, setIsSearchMode, resetFilters } = useVenueStore();

    const handleReset = () => {
        setSearchQuery("");
        setIsSearchMode(false);
        resetFilters();
    };
    return (
        <footer className="flex justify-between border-t border-t-slate-900/50 bg-slate-50 p-8 pb-12">
            <Link to={"/"} onClick={handleReset} className="flex">
                <p className="text-[#088D9A] m-auto ml-2 text-xl logo hover:scale-110 transition duration-150">
                    &copy; Holidaze
                </p>
            </Link>
            <img
                src="/img/holidaze.svg"
                alt="Holidaze Logo"
                className="h-10 absolute left-1/2 -ml-[20px]"
            />
            <Link
                to={"/about"}
                className="logo text-md text-[#088D9A] hover:scale-110 transition duration-150 my-auto"
            >
                About Us
            </Link>
        </footer>
    );
}

export { Footer };
