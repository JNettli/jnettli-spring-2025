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
        <div className="flex flex-col justify-center">
            <div className="bg-white max-w-7xl min-w-fit">
                <p className="text-lg">Profile Page</p>
                <img src={profile.banner.url} alt={profile.banner.alt} />
                <img
                    src={profile.avatar.url}
                    alt={profile.avatar.alt}
                    className="h-48 w-48 object-cover rounded-full"
                />
                <p>{profile.name}</p>
                <p>{profile.email}</p>
                <p>{profile.bio}</p>
                <p className="mb-2">{profile.venueManager ? "Yes" : "No"}</p>
                <Link
                    to={editProfile}
                    className="bg-blue-300 px-4 py-2 rounded"
                >
                    Edit Profile!
                </Link>
                {isLoggedIn && profile.venueManager ? (
                    <Link
                        to={"/create"}
                        className="bg-blue-500 px-4 py-2 rounded ml-2"
                    >
                        Create Venue
                    </Link>
                ) : (
                    ""
                )}
            </div>
            <div className="mt-8 w-full max-w-7xl flex gap-8">
                <div className="flex flex-col max-w-1/2">
                    <h2 className="text-xl font-semibold mb-4">My Venues</h2>
                    {venuesLoading ? (
                        <div>Loading venues...</div>
                    ) : venues.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {venues.map((venue) => (
                                <Link
                                    to={`/venue/${venue.id}`}
                                    key={venue.id}
                                    className="border p-4 rounded"
                                >
                                    <img
                                        src={
                                            venue.media?.[0]?.url ||
                                            "/placeholder.jpg"
                                        }
                                        className="h-40 w-full object-cover rounded"
                                    />
                                    <h3 className="text-lg font-bold mt-2 truncate">
                                        {venue.name}
                                    </h3>
                                    <p className="text-gray-600">
                                        {venue.location?.city},{" "}
                                        {venue.location?.country}
                                    </p>
                                    <p className="text-gray-800 font-semibold">
                                        ${venue.price}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p>No venues found.</p>
                    )}
                </div>
                <div className="flex flex-col max-w-1/2">
                    <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
                    {bookingsLoading ? (
                        <div>Loading bookings...</div>
                    ) : bookings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookings.map((booking) => (
                                <Link
                                    to={`/venue/${booking.venue.id}`}
                                    key={booking.venue.id}
                                    className="border p-4 rounded"
                                >
                                    <h3 className="text-lg font-bold mt-2 truncate">
                                        {booking.venue.name}
                                    </h3>
                                    <p className="text-gray-600">
                                        {booking.venue.location?.city}
                                    </p>
                                    <p>Booked:</p>
                                    <p>
                                        {" "}
                                        {new Date(
                                            booking.dateFrom
                                        ).toLocaleDateString("en-GB", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                    <p>
                                        {" "}
                                        {new Date(
                                            booking.dateTo
                                        ).toLocaleDateString("en-GB", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}{" "}
                                    </p>
                                    <p>
                                        (
                                        {differenceInCalendarDays(
                                            new Date(booking.dateTo),
                                            new Date(booking.dateFrom)
                                        )}{" "}
                                        nights)
                                    </p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p>No bookings found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
