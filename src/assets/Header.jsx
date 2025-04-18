import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";

function Header() {
    return (
        <header className="flex justify-between px-16 py-2 min-w-screen border-b border-b-slate-900/50">
            <Link to={"/"} className="bg-[#007A8D] rounded-lg px-4 pt-3">
                Holidaze
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
            <LoginModal />
        </header>
    );
}

export { Header };
