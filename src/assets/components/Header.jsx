import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import { isLoggedIn } from "./functions";
import SearchBar from "./Search";

function Header() {
    const loggedIn = isLoggedIn();
    const profileId = "/profile/" + localStorage.getItem("userName");
    return (
        <header className="flex justify-between px-16 py-7 border-b border-b-slate-900/50">
            <Link to={"/"} className="flex absolute top-4">
                <img
                    src="/img/holidaze.svg"
                    alt="Holidaze Logo"
                    className="h-10 my-auto"
                />
                <p className="text-[#088D9A] m-auto ml-2 text-xl logo">
                    Holidaze
                </p>
            </Link>
            <div className="left-1/2 transform -translate-x-1/2 bg-white rounded-full min-w-sm absolute top-4">
                <SearchBar />
            </div>
            {loggedIn && (
                <Link to={profileId}>
                    <img
                        src={
                            localStorage.getItem("userImage") ||
                            "/img/profile.svg"
                        }
                        alt="Profile"
                        className="h-9 w-9 absolute top-4 right-35 rounded-full outline-[#088D9A] outline-2"
                        title={`${localStorage.getItem("userName")}'s Profile`}
                    />
                </Link>
            )}
            <LoginModal />
        </header>
    );
}

export { Header };
