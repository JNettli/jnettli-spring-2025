import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ToastContainer } from "react-toastify";

function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-4 pb-16 bg-slate-50">
                <Outlet />
            </main>
            <Footer />
            <ToastContainer position="top-center" autoClose={3000} />
        </div>
    );
}

export { Layout };
