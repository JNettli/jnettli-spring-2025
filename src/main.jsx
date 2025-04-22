import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Layout } from "./assets/Layout";
import {
    App,
    Venue,
    Checkout,
    Profile,
    EditProfile,
    EditVenue,
    Success,
    About,
} from "./pages/Pages";
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
                path: "/checkout",
                element: <Checkout />,
            },
            {
                path: "/checkout/success",
                element: <Success />,
            },
            {
                path: "/venue/:venueId",
                element: <Venue />,
            },
            {
                path: "venues/edit",
                element: <EditVenue />,
            },
            {
                path: "/profile",
                element: <Profile />,
            },
            {
                path: "/profile/edit",
                element: <EditProfile />,
            },
            {
                path: "/about",
                element: <About />,
            },
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
