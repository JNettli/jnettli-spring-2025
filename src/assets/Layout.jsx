import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

function Layout() {
    return (
        <div className="flex flex-col min-h-screen min-w-screen">
            <Header />
            <main className="flex-grow pt-4 pb-16">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export { Layout };
