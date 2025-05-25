import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Layout } from "./assets/Layout";
import {
    App,
    Venue,
    Profile,
    CreateVenue,
    EditProfile,
    EditVenue,
    Success,
    About,
} from "./pages/Pages";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async"; // ✅ Add this

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "", element: <App /> },
            { path: "/success", element: <Success /> },
            { path: "/create", element: <CreateVenue /> },
            { path: "/venue/:venueId", element: <Venue /> },
            { path: "venues/edit/:venueId", element: <EditVenue /> },
            { path: "/profile/:profileId", element: <Profile /> },
            { path: "/profile/edit/:profileId", element: <EditProfile /> },
            { path: "/about", element: <About /> },
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <HelmetProvider>
            <RouterProvider router={router} />
        </HelmetProvider>
    </StrictMode>
);
