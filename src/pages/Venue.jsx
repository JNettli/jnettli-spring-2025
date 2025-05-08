import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { APIBookings, APIVenues } from "../assets/Constants";
import { MapDisplay } from "../assets/components/Map";
import { DateRange } from "react-date-range";
import { eachDayOfInterval } from "date-fns";
import { APIKEY } from "../assets/auth";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

function Venue() {
    const { venueId } = useParams();
    const [venue, setVenue] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const leftCalendar = useRef(null);
    const rightCalendar = useRef(null);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const [bookedDates, setBookedDates] = useState([]);
    const disabledDates = bookedDates.flatMap((booking) =>
        eachDayOfInterval({
            start: new Date(booking.dateFrom),
            end: new Date(booking.dateTo),
        })
    );
    const [guests, setGuests] = useState(1);
    const userBookings = bookedDates.filter(
        (booking) => booking.customer?.name === localStorage.getItem("userName")
    );
    const [editBookingId, setEditBookingId] = useState(null);
    const [editData, setEditData] = useState({
        dateFrom: new Date(),
        dateTo: new Date(),
        guests: 1,
    });

    useEffect(() => {
        const calendars = document.querySelectorAll(".rdrMonth");
        if (calendars.length === 2) {
            leftCalendar.current = calendars[0];
            rightCalendar.current = calendars[1];
        }
    }, [venue]);

    const handleBooking = async () => {
        const { startDate, endDate } = dateRange[0];

        const bookingInfo = {
            dateFrom: startDate.toISOString(),
            dateTo: endDate.toISOString(),
            guests: guests,
            venueId: venueId,
        };

        console.log(bookingInfo);
        try {
            const res = await fetch(APIBookings, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "X-Noroff-API-Key": APIKEY,
                },
                body: JSON.stringify(bookingInfo),
            });

            if (!res.ok) throw new Error("Booking failed!");
            console.log("Booking Successful!");
        } catch (error) {
            console.error("Error while submitting booking: ", error);
        }
    };

    useEffect(() => {
        if (!venueId) return;

        async function fetchVenue() {
            try {
                const res = await fetch(
                    APIVenues + "/" + venueId + "?_owner=true&_bookings=true"
                );
                const data = await res.json();
                document.title = data.data.name + " | Holidaze";
                setVenue(data.data);
                setBookedDates(data.data.bookings);

                const currentUsername = localStorage.getItem("userName");
                if (data.data.owner.name === currentUsername) {
                    setIsOwner(true);
                } else {
                    setIsOwner(false);
                }
            } catch (error) {
                console.error("Error fetching venue or bookings:", error);
            }
        }
        fetchVenue();
    }, [venueId]);

    function handleEditClick(booking) {
        setEditBookingId(booking.id);
        setEditData({
            dateFrom: new Date(booking.dateFrom),
            dateTo: new Date(booking.dateTo),
            guests: booking.guests,
        });
    }

    async function handleUpdateBooking(e) {
        e.preventDefault();
        try {
            const res = await fetch(`${APIBookings}/${editBookingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "X-Noroff-API-Key": APIKEY,
                },
                body: JSON.stringify({
                    dateFrom: editData.dateFrom.toISOString(),
                    dateTo: editData.dateTo.toISOString(),
                    guests: editData.guests,
                }),
            });

            if (!res.ok) throw new Error("Failed to update booking");

            alert("Booking updated!");
            setEditBookingId(null);
        } catch (error) {
            console.error("Update failed:", error);
        }
    }

    async function handleDeleteBooking(bookingId) {
        const confirmDelete = window.confirm(
            "Are you sure you want to cancel this booking?"
        );
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${APIBookings}/${bookingId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "X-Noroff-API-Key": APIKEY,
                },
            });

            if (!res.ok) throw new Error("Failed to delete booking");

            alert("Booking deleted!");
            setBookedDates((prev) => prev.filter((b) => b.id !== bookingId));
        } catch (error) {
            console.error("Delete failed:", error);
        }
    }

    if (!venueId) return <p>No venue ID provided.</p>;

    if (!venue) return <p>Loading venue...</p>;

    return (
        <div>
            {isOwner ? <Link to={`/venues/edit/${venueId}`}>Here!</Link> : ""}
            <img src={venue.media[0].url} alt={venue.media[0].alt} />
            <h1 className="truncate">{venue.name}</h1>
            <p className="truncate">{venue.description}</p>
            <p>Price per night: {venue.price}$</p>
            <p>Rating: {venue.rating}</p>
            <p>
                Address:{" "}
                {venue.location.address === "" ? "N/A" : venue.location.address}
            </p>
            <p>
                City: {venue.location.city === "" ? "N/A" : venue.location.city}
            </p>
            <p>
                Country:{" "}
                {venue.location.country === "" ? "N/A" : venue.location.country}
            </p>
            <p>
                Zip code:{" "}
                {venue.location.zip === "" ? "N/A" : venue.location.zip}
            </p>
            <p>Max Guests: {venue.maxGuests}</p>
            <p>Wifi: {venue.meta.wifi ? "Yes" : "No"}</p>
            <p>Breakfast: {venue.meta.breakfast ? "Yes" : "No"}</p>
            <p>Pets: {venue.meta.pets ? "Yes" : "No"}</p>
            <p>Parking: {venue.meta.parking ? "Yes" : "No"}</p>
            <label className="block my-4">
                Number of guests:
                <input
                    type="number"
                    value={guests}
                    min={1}
                    max={venue.maxGuests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="border p-2 rounded ml-2 w-32"
                />
            </label>
            <h2 className="text-xl font-bold mt-6 mb-2">Pick your date</h2>
            <DateRange
                editableDateInputs={true}
                onChange={(item) => {
                    const clickedElement = document.activeElement;

                    if (leftCalendar.current?.contains(clickedElement)) {
                        setDateRange([
                            {
                                ...dateRange[0],
                                startDate: item.selection.startDate,
                                endDate: dateRange[0].endDate,
                            },
                        ]);
                    } else if (
                        rightCalendar.current?.contains(clickedElement)
                    ) {
                        setDateRange([
                            {
                                ...dateRange[0],
                                startDate: dateRange[0].startDate,
                                endDate: item.selection.endDate,
                            },
                        ]);
                    } else {
                        setDateRange([item.selection]);
                    }
                }}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                disabledDates={disabledDates}
                minDate={new Date()}
            />
            <button
                onClick={handleBooking}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Book Now
            </button>

            <p>Currently Booked: {venue._count.bookings}</p>
            <div className="flex gap-2">
                {userBookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="border p-4 my-2 rounded w-42"
                    >
                        <p>
                            <strong>Your booking:</strong>
                        </p>
                        <p>
                            From:{" "}
                            {new Date(booking.dateFrom).toLocaleDateString()}{" "}
                            <br />
                            To: {new Date(
                                booking.dateTo
                            ).toLocaleDateString()}{" "}
                            <br />
                            Guests: {booking.guests}
                        </p>
                        <button
                            className="text-white mt-2 p-2 bg-blue-600 rounded w-full cursor-pointer"
                            onClick={() => handleEditClick(booking)}
                        >
                            Edit Booking
                        </button>
                        <button
                            className="text-white mt-2 p-2 bg-red-600 rounded w-full cursor-pointer"
                            onClick={() => handleDeleteBooking(booking.id)}
                        >
                            Delete Booking
                        </button>

                        {editBookingId === booking.id && (
                            <form
                                onSubmit={handleUpdateBooking}
                                className="mt-4 space-y-2"
                            >
                                <label>
                                    From:
                                    <input
                                        type="date"
                                        value={
                                            editData.dateFrom
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                dateFrom: new Date(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        required
                                        className="border rounded p-1 w-full"
                                    />
                                </label>
                                <br />
                                <label>
                                    To:
                                    <input
                                        type="date"
                                        value={
                                            editData.dateTo
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                dateTo: new Date(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        required
                                        className="border rounded p-1 w-full"
                                    />
                                </label>
                                <br />
                                <label>
                                    Guests:
                                    <input
                                        type="number"
                                        min="1"
                                        value={editData.guests}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                guests: parseInt(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        required
                                        className="border rounded p-1 w-full"
                                    />
                                </label>
                                <br />
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-3 py-1 rounded"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditBookingId(null)}
                                    className="ml-2 text-red-500"
                                >
                                    Cancel
                                </button>
                            </form>
                        )}
                    </div>
                ))}
            </div>

            <MapDisplay lat={venue.location.lat} lng={venue.location.lng} />
        </div>
    );
}

export default Venue;
