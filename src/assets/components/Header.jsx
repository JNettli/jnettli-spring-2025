import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import { isLoggedIn } from "./functions";

function Header() {
    const loggedIn = isLoggedIn();
    const profileId = "/profile/" + localStorage.getItem("userName");
    return (
        <header className="flex justify-between px-16 py-2 border-b border-b-slate-900/50">
            <Link to={"/"} className="flex">
                <img
                    src="/src/assets/favicon/favicon.svg"
                    alt="Holidaze Logo"
                    className="h-10 my-auto"
                />
                <p className="text-[#088D9A] m-auto ml-2 text-xl logo">
                    Holidaze
                </p>
            </Link>
            <div className="bg-white rounded-full min-w-2xl -mb-8 mt-6 border border-slate-900/50 relative">
                <div className="flex gap-1 h-full">
                    <div className="flex-1 transition hover:bg-slate-200 rounded-l-4xl rounded-r-lg p-4 w-full text-center cursor-pointer">
                        Left
                    </div>
                    <div className="border-l border-slate-900/50 h-10 mt-2"></div>
                    <div className="flex-1 transition hover:bg-slate-200 rounded-lg p-4 w-full text-center cursor-pointer">
                        Middle
                    </div>
                    <div className="border-l border-slate-900/50 h-10 mt-2"></div>
                    <div className="flex-1 transition hover:bg-slate-200 rounded-r-4xl rounded-l-lg p-4 w-full text-center cursor-pointer">
                        Right
                    </div>
                </div>
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
