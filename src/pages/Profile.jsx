import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { APIProfile } from "../assets/Constants";
import { APIKEY } from "../assets/auth";
import { checkLogin, isLoggedIn } from "../assets/components/functions";
import { differenceInCalendarDays } from "date-fns";

function Profile() {
    const profileId = localStorage.getItem("userName");
    const profileMail = localStorage.getItem("userId");
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [venues, setVenues] = useState([]);
    const [venuesLoading, setVenuesLoading] = useState(true);
    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);
    const [view, setView] = useState("venues");

    useEffect(() => {
        if (!profileId) {
            checkLogin();
        }

        async function fetchProfile() {
            try {
                const res = await fetch(APIProfile + "/" + profileId, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        "X-Noroff-API-Key": APIKEY,
                    },
                });
                const data = await res.json();
                document.title =
                    data.data.name +
                    " | Holidaze " +
                    (data.data.venueManager ? "Venue Manager" : "User");
                setProfile(data.data);
            } catch (error) {
                console.error("Error fetching venue:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [profileId]);

    useEffect(() => {
        if (!profile?.name) return;

        async function fetchVenues() {
            try {
                const res = await fetch(
                    `${APIProfile}/${profile.name}/venues`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                            "X-Noroff-API-Key": APIKEY,
                        },
                    }
                );
                const data = await res.json();
                setVenues(data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setVenuesLoading(false);
            }
        }

        fetchVenues();
    }, [profile]);

    useEffect(() => {
        if (!profile?.name) return;

        async function fetchBookings() {
            try {
                const res = await fetch(
                    `${APIProfile}/${profile.name}/bookings?_venue=true`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                            "X-Noroff-API-Key": APIKEY,
                        },
                    }
                );
                const data = await res.json();
                setBookings(data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setBookingsLoading(false);
            }
        }

        fetchBookings();
    }, [profile]);

    const editProfile = "/profile/edit/" + profileMail;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!profile) {
        return <div>Error: Profile not found.</div>;
    }

    return (
        <div className="flex flex-col items-center px-4 py-8">
            <div className="flex lg:flex-row flex-col justify-around lg:gap-8">
                <div className="max-w-screen">
                    <div className="max-w-sm rounded-xl bg-white py-8 px-2 shadow-lg mb-12 flex gap-4">
                        <div className="flex flex-col gap-2 w-fit">
                            <img
                                src={profile.avatar.url}
                                alt={profile.avatar.alt}
                                className="h-24 w-24 max-h-24 max-w-24 object-cover relative rounded-full border-4 border-[#088D9A] shadow-md"
                            />
                            <h1 className="text-center text-2xl font-bold text-[#088D9A]">
                                {profile.name}
                            </h1>
                        </div>
                        <div className="flex flex-col justify-evenly py-2">
                            <p className="text-slate-600">{profile.email}</p>
                            <div className="border-b border-b-slate-900/20"></div>
                            <p className="mt-2 font-medium text-slate-700">
                                Venue Manager:{" "}
                                <span
                                    className={
                                        profile.venueManager
                                            ? "text-green-600"
                                            : "text-red-500"
                                    }
                                >
                                    {profile.venueManager ? "Yes" : "No"}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 justify-center gap-4 flex-wrap lg:flex hidden">
                        {isLoggedIn && (
                            <Link
                                to={editProfile}
                                className="bg-[#088D9A] text-white px-6 py-2 rounded-lg hover:bg-[#97d0d5] hover:text-black transition"
                            >
                                Edit Profile
                            </Link>
                        )}
                        {isLoggedIn && profile.venueManager && (
                            <Link
                                to="/create"
                                className="bg-[#97d0d5] text-black px-6 py-2 rounded-lg hover:bg-[#077d89] hover:text-white transition"
                            >
                                Create Venue
                            </Link>
                        )}
                    </div>
                </div>

                <div className="lg:w-lg lg:mt-4 -mt-4 max-w-sm">
                    {profile.bio && (
                        <>
                            <h2 className="text-xl font-bold text-[#088D9A]">
                                About {profile.name}:
                            </h2>
                            <p className="mt-2 text-slate-700 line-clamp-5 max-w-full text-ellipsis">
                                {profile.bio}
                            </p>
                            <div className="border-b border-slate-900/20 my-4"></div>
                            <p className="mt-2 text-slate-700 line-clamp-5 max-w-full">
                                Total Venues: {profile._count.venues}
                            </p>
                        </>
                    )}
                </div>

                <div className="mt-4 justify-center gap-4 flex-wrap lg:hidden flex">
                    {isLoggedIn && (
                        <Link
                            to={editProfile}
                            className="bg-[#088D9A] text-white px-6 py-2 rounded-lg hover:bg-[#97d0d5] hover:text-black transition"
                        >
                            Edit Profile
                        </Link>
                    )}
                    <div className="border-r border-slate-900/20"></div>
                    {isLoggedIn && profile.venueManager && (
                        <Link
                            to="/create"
                            className="bg-[#97d0d5] text-black px-6 py-2 rounded-lg hover:bg-[#077d89] hover:text-white transition"
                        >
                            Create Venue
                        </Link>
                    )}
                </div>
            </div>
            <div className="border-b border-slate-900/20 my-8 w-4/5"></div>
            <div className="w-full max-w-7xl flex flex-col">
                <div className="flex justify-center mb-6">
                    <div
                        className="relative flex w-64 bg-white shadow-lg rounded-full p-2 cursor-pointer transition"
                        onClick={() =>
                            setView((prev) =>
                                prev === "venues" ? "bookings" : "venues"
                            )
                        }
                    >
                        <div
                            className={`absolute top-1 left-1 h-8 w-1/2 rounded-full bg-[#088D9A] shadow-md transform transition-transform duration-300 ${
                                view === "bookings" ? "translate-x-30" : ""
                            }`}
                        ></div>
                        <div
                            className={`flex-1 text-center z-10 font-semibold transition duration-300 ${
                                view === "venues"
                                    ? "text-white"
                                    : "text-slate-600"
                            }`}
                        >
                            Venues
                        </div>
                        <div
                            className={`flex-1 text-center z-10 font-semibold transition duration-300 ${
                                view === "bookings"
                                    ? "text-white"
                                    : "text-slate-600"
                            }`}
                        >
                            Bookings
                        </div>
                    </div>
                </div>

                {view === "venues" && (
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">
                            My Venues
                        </h2>
                        {venuesLoading ? (
                            <p>Loading venues...</p>
                        ) : venues.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-3 gap-6">
                                {venues.map((venue) => (
                                    <Link
                                        to={`/venue/${venue.id}`}
                                        key={venue.id}
                                        className="bg-white rounded-xl shadow hover:shadow-lg transition p-4"
                                    >
                                        <img
                                            src={
                                                venue.media?.[0]?.url ||
                                                "/placeholder.jpg"
                                            }
                                            className="h-40 w-full object-cover rounded-md mb-3"
                                            alt={venue.name}
                                        />
                                        <h3 className="text-lg font-semibold truncate">
                                            {venue.name}
                                        </h3>
                                        <p className="text-slate-500 text-sm">
                                            {venue.location?.city},{" "}
                                            {venue.location?.country}
                                        </p>
                                        <p className="text-slate-800 font-bold mt-1">
                                            ${venue.price}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500">No venues found.</p>
                        )}
                    </div>
                )}

                {view === "bookings" && (
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">
                            My Bookings
                        </h2>
                        {bookingsLoading ? (
                            <p>Loading bookings...</p>
                        ) : bookings.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-6">
                                {bookings.map((booking) => (
                                    <Link
                                        to={`/venue/${booking.venue.id}`}
                                        key={booking.venue.id}
                                        className="bg-white rounded-xl shadow hover:shadow-lg transition p-4"
                                    >
                                        <h3 className="text-lg font-semibold truncate mb-1">
                                            {booking.venue.name}
                                        </h3>
                                        <p className="text-slate-500 text-sm mb-2">
                                            {booking.venue.location?.city}
                                        </p>
                                        <p className="text-slate-600 text-sm">
                                            <span className="font-medium">
                                                From:
                                            </span>{" "}
                                            {new Date(
                                                booking.dateFrom
                                            ).toLocaleDateString("en-GB", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                        <p className="text-slate-600 text-sm mb-1">
                                            <span className="font-medium">
                                                To:
                                            </span>{" "}
                                            {new Date(
                                                booking.dateTo
                                            ).toLocaleDateString("en-GB", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                        <p className="text-slate-800 font-medium">
                                            {differenceInCalendarDays(
                                                new Date(booking.dateTo),
                                                new Date(booking.dateFrom)
                                            ) + 1}{" "}
                                            {differenceInCalendarDays(
                                                new Date(booking.dateTo),
                                                new Date(booking.dateFrom)
                                            ) +
                                                1 ===
                                            1
                                                ? "night"
                                                : "nights"}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500">No bookings found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
