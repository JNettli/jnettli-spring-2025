import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-4 pb-16 bg-slate-50">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export { Layout };
