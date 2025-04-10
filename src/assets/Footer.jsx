import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="flex justify-between border-t border-t-slate-900/50 p-8 pb-12">
            <p>&copy; Holidaze</p>
            <Link
                to={"/venues"}
                className="hover:text-[#81BFDA] transition duration-150"
            >
                VenueList
            </Link>
        </footer>
    );
}

export { Footer };
