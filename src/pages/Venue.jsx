import { useParams, Link, useNavigate } from "react-router-dom";
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
    const dialogRef = useRef(null);

    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const [bookedDates, setBookedDates] = useState([]);
    const [checkoutData, setCheckoutData] = useState(null);
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
    const navigate = useNavigate();

    useEffect(() => {
        const calendars = document.querySelectorAll(".rdrMonth");
        if (calendars.length === 2) {
            leftCalendar.current = calendars[0];
            rightCalendar.current = calendars[1];
        }
    }, [venue]);

    const handleBooking = () => {
        const { startDate, endDate } = dateRange[0];
        const bookingInfo = {
            dateFrom: startDate.toISOString(),
            dateTo: endDate.toISOString(),
            guests: guests,
            venueId: venueId,
            price: venue.price,
        };
        setCheckoutData(bookingInfo);
        dialogRef.current?.showModal();
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
                setIsOwner(data.data.owner.name === currentUsername);
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
        <div className="flex flex-col items-center">
        <div className="w-full flex flex-col items-center">
            {isOwner && <Link to={`/venues/edit/${venueId}`}>Here!</Link>}
            <img src={venue.media[0].url} alt={venue.media[0].alt} className="h-128 object-cover w-1/2" />
            <div className="border-b border-slate-900/50 my-4 w-4/5"></div>
        </div>
        <div className="flex w-full justify-around mt-4">
            <div className="w-1/2 bg-red-400">

            <h1 className="truncate max-w-50">{venue.name}</h1>
            <p className="truncate max-w-50">{venue.description}</p>
            <p>Price per night: {venue.price}$</p>
            <p>Rating: {venue.rating}</p>
            <p>Address: {venue.location.address || "N/A"}</p>
            <p>City: {venue.location.city || "N/A"}</p>
            <p>Country: {venue.location.country || "N/A"}</p>
            <p>Zip code: {venue.location.zip || "N/A"}</p>
            <p>Max Guests: {venue.maxGuests}</p>
            <p>Wifi: {venue.meta.wifi ? "Yes" : "No"}</p>
            <p>Breakfast: {venue.meta.breakfast ? "Yes" : "No"}</p>
            <p>Pets: {venue.meta.pets ? "Yes" : "No"}</p>
            <p>Parking: {venue.meta.parking ? "Yes" : "No"}</p>
            <p>Currently Booked: {venue._count.bookings}</p>
            </div>
            {console.log(venue)}



            <div className="flex flex-col w-fit items-center gap-4">
            <div className="border border-slate-900/50 rounded-xl p-4 w-fit">
                <img src={venue.owner.avatar.url} alt={venue.owner.avatar.alt} className="h-32 w-32 rounded-full object-cover border-4 border-[#088D9A]" />
                <p>VenueOwner: {venue.owner.name}</p>
                <p>VenueOwnerBio: {venue.owner.bio == "" ? "I sure love being a venue owner!" :  venue.owner.bio}</p>
            </div>
            <div className="flex flex-col border border-slate-900/50 shadow rounded-xl p-4 w-full">

            <h2 className="text-xl font-bold mb-2">Pick your date</h2>
            <DateRange
                editableDateInputs={true}
                onChange={(item) => {
                    const clickedElement = document.activeElement;
                    if (leftCalendar.current?.contains(clickedElement)) {
                        setDateRange([
                            {
                                ...dateRange[0],
                                startDate: item.selection.startDate,
                            },
                        ]);
                    } else if (
                        rightCalendar.current?.contains(clickedElement)
                    ) {
                        setDateRange([
                            {
                                ...dateRange[0],
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
                className="w-fit self-center"
                />

            <label className="my-4">
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

            <button
                onClick={handleBooking}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                Book Now
            </button>
                    </div>
                </div>

            <dialog
                ref={dialogRef}
                className="rounded p-6 w-96 max-w-md shadow-xl border transform duration-300"
                >
                <h2 className="text-xl font-bold mb-4">Confirm Your Booking</h2>
                {checkoutData && (
                    <div className="space-y-2 text-sm text-gray-700 flex flex-col">
                        <p className="flex justify-between">
                            <strong>From:</strong>{" "}
                            {new Date(
                                checkoutData.dateFrom
                            ).toLocaleDateString()}
                        </p>
                        <p className="flex justify-between">
                            <strong>To:</strong>{" "}
                            {new Date(checkoutData.dateTo).toLocaleDateString()}
                        </p>
                        <p className="flex justify-between">
                            <strong>Total Nights:</strong>{" "}
                            {(new Date(checkoutData.dateTo) -
                                new Date(checkoutData.dateFrom)) /
                                (1000 * 60 * 60 * 24) +
                                1}
                        </p>
                        <p className="flex justify-between">
                            <strong>Price per Night:</strong> $
                            {checkoutData.price}
                        </p>
                        <p className="flex justify-between">
                            <strong>Guests:</strong> {checkoutData.guests}
                        </p>
                        <div className="border-b border-slate-900/50"></div>
                        <p className="flex justify-between">
                            <strong>Total Price: </strong>
                            <strong>
                                $
                                {((new Date(checkoutData.dateTo) -
                                    new Date(checkoutData.dateFrom)) /
                                    (1000 * 60 * 60 * 24) +
                                    1) *
                                    checkoutData.price}
                            </strong>
                        </p>
                    </div>
                )}
                <div className="mt-6 flex justify-end gap-4">
                    <button
                        onClick={() => {
                            dialogRef.current.close();
                            setCheckoutData(null);
                        }}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            try {
                                const res = await fetch(APIBookings, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${localStorage.getItem(
                                            "token"
                                        )}`,
                                        "X-Noroff-API-Key": APIKEY,
                                    },
                                    body: JSON.stringify(checkoutData),
                                });
                                if (!res.ok) throw new Error("Booking failed!");
                                dialogRef.current.close();
                                setCheckoutData(null);
                                navigate("/success", {
                                    state: {
                                        venue: venue.name,
                                        dateFrom: checkoutData.dateFrom,
                                        dateTo: checkoutData.dateTo,
                                        guests: checkoutData.guests,
                                        price: checkoutData.price,
                                    },
                                });
                            } catch (error) {
                                console.error(
                                    "Error while submitting booking: ",
                                    error
                                );
                                alert("Booking failed. Try again.");
                            }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                        Confirm Booking
                    </button>
                </div>
            </dialog>
        </div>

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
            <div className="relative z-10">
            <MapDisplay lat={venue.location.lat} lng={venue.location.lng} />
            </div>
                </div>
    );
}

export default Venue;
