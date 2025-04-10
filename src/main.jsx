import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Layout } from "./assets/Layout";
import { App, Venue, VenueList, Profile } from "./pages/Pages";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "",
                element: <App />,
            },
            {
                path: "/venues",
                element: <VenueList />,
            },
            {
                path: "/venues/:venueId",
                element: <Venue />,
            },
            {
                path: "/profile",
                element: <Profile />,
            },
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
