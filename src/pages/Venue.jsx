import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { APIBookings, APIVenues } from "../assets/Constants";
import { MapDisplay } from "../assets/components/Map";
import { DateRange } from "react-date-range";
import { eachDayOfInterval } from "date-fns";
import { APIKEY } from "../assets/auth";
import "react-toastify/dist/ReactToastify.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Helmet } from "react-helmet-async";

function Venue() {
    const { venueId } = useParams();
    const [venue, setVenue] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const leftCalendar = useRef(null);
    const rightCalendar = useRef(null);
    const dialogRef = useRef(null);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [mainImageIndex, setMainImageIndex] = useState(0);

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
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const calendars = document.querySelectorAll(".rdrMonth");
        if (calendars.length === 2) {
            leftCalendar.current = calendars[0];
            rightCalendar.current = calendars[1];
        }
    }, [venue]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const confirmDelete = () => {
        if (bookingToDelete) {
            handleDeleteBooking(bookingToDelete);
            setShowConfirmModal(false);
        }
    };

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

    async function handleUpdateBooking() {
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

            setEditBookingId(null);
            toast.success("Booking updated successfully");
            window.location.reload();
        } catch (error) {
            toast.error(error.message || "Error updating booking");
            console.error(error);
        }
    }

    async function handleDeleteBooking(bookingId) {
        try {
            const res = await fetch(`${APIBookings}/${bookingId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "X-Noroff-API-Key": APIKEY,
                },
            });

            if (!res.ok) throw new Error("Failed to delete booking");

            setBookedDates((prev) => prev.filter((b) => b.id !== bookingId));
            toast.success("Booking deleted successfully");
        } catch (error) {
            toast.error("Error deleting booking");
            console.error(error);
        }
    }
    useEffect(() => {
        if (venue && venue.media && mainImageIndex >= venue.media.length) {
            setMainImageIndex(0);
        }
    }, [venue, mainImageIndex]);

    if (!venueId) return <p>No venue ID provided.</p>;
    if (!venue) return <p>Loading venue...</p>;

    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content="Explore this beautiful venue and all it has to offer. Book now for a unique and unforgettable experience."
                />
                <meta
                    name="keywords"
                    content="venue, booking, holiday, stay, travel, vacation, accommodation, Holidaze"
                />
                <meta name="author" content="JNettli" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta
                    property="og:title"
                    content={`${venue.name} | Holidaze`}
                />
                <meta property="og:description" content={venue.description} />
                <meta property="og:image" content={venue.media[0].url} />
            </Helmet>

            <div className="flex flex-col items-center">
                <ToastContainer position="top-center" autoClose={3000} />
                <div className="w-full">
                    <div className="w-full flex lg:flex-row flex-col items-center gap-2 justify-center">
                        <div className="overflow-hidden rounded-xl shadow-md bg-slate-50 lg:max-w-2/3 md:max-w-4/5 w-fit lg:max-h-[632px] md:max-h-96 max-h-64 h-fit flex items-center justify-center">
                            <a
                                href={venue.media[mainImageIndex]?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={venue.media[mainImageIndex]?.url}
                                    alt={venue.media[mainImageIndex]?.alt}
                                    className="h-full w-full max-h-full max-w-full object-contain cursor-pointer"
                                />
                            </a>
                        </div>

                        {venue.media?.length > 1 && (
                            <div className="flex lg:flex-col flex-row flex-wrap gap-2 lg:w-20 w-full justify-center">
                                <div className="flex gap-2 flex-wrap justify-center">
                                    {venue.media.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image.url}
                                            alt={image.alt}
                                            className={`w-18 h-18 object-cover rounded-md cursor-pointer border-4 ${
                                                mainImageIndex === index
                                                    ? "border-[#088D9A]"
                                                    : "border-slate-300"
                                            }`}
                                            onClick={() => {
                                                setMainImageIndex(index);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-b border-slate-900/20 my-4 w-4/5"></div>
                <div>
                    <div className="flex w-full max-w-5xl lg:justify-around gap-4 lg:items-start items-center mt-4 lg:flex-row flex-col">
                        <div className="lg:w-2/3 w-full flex flex-col gap-6">
                            <h1 className="text-center font-bold text-4xl text-[#088D9A] w-full truncate">
                                {venue.name}
                            </h1>
                            <div className="border-b border-slate-900/20 mx-auto w-4/5"></div>

                            <div className="lg:px-0 px-8">
                                <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                                    About This Place
                                </h2>
                                <p
                                    className={`text-base text-slate-700 whitespace-pre-line ${
                                        showFullDesc ? "" : "line-clamp-5"
                                    }`}
                                >
                                    {venue.description}
                                </p>
                                {venue.description.length > 300 && (
                                    <>
                                        <button
                                            onClick={() =>
                                                setShowFullDesc(!showFullDesc)
                                            }
                                            className="cursor-pointer relative w-fit left-1/2 -translate-x-1/2 top-3"
                                        >
                                            <p className="text-slate-700 bg-slate-50 mx-auto px-1">
                                                {showFullDesc
                                                    ? "Show less"
                                                    : "Show more"}
                                            </p>
                                        </button>
                                        <div className="border-b border-slate-900/20 w-2/5 mx-auto"></div>
                                    </>
                                )}
                            </div>

                            <div className="border-b border-slate-900/20 mx-auto w-4/5"></div>
                            <div className="flex flex-wrap justify-evenly text-base text-slate-800">
                                <span className="font-medium">Max Guests:</span>{" "}
                                <div className="flex gap-2">
                                    {venue.maxGuests}
                                    <img
                                        src="/img/profile.svg"
                                        alt="Guest Icon"
                                        className="h-4 my-auto"
                                    />
                                </div>
                                <span className="font-medium">
                                    Currently Booked:
                                </span>{" "}
                                {venue._count.bookings}
                            </div>

                            <div className="border-b border-slate-900/20 mx-auto w-4/5"></div>
                            <div className="lg:px-0 px-8">
                                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                                    Amenities
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {[
                                        {
                                            label: "Wifi",
                                            value: venue.meta.wifi,
                                        },
                                        {
                                            label: "Parking",
                                            value: venue.meta.parking,
                                        },
                                        {
                                            label: "Breakfast",
                                            value: venue.meta.breakfast,
                                        },
                                        {
                                            label: "Pets",
                                            value: venue.meta.pets,
                                        },
                                    ].map(({ label, value }) => (
                                        <span
                                            key={label}
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                value
                                                    ? "bg-[#088D9A] text-white"
                                                    : "bg-slate-200 text-slate-500 line-through"
                                            }`}
                                        >
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-900/10 shadow-md p-4 flex flex-col w-full max-w-full justify-between mt-8">
                                <h3 className="text-lg font-semibold text-slate-800 mb-2 bg-slate-50 relative -top-8 w-fit px-1">
                                    Location
                                </h3>
                                <div className="flex justify-between -mt-10 mb-4 truncate">
                                    <div className="flex w-full justify-evenly text-center gap-4 md:flex-row flex-col">
                                        <div className="text-slate-700 truncate">
                                            <p className="font-semibold text-lg">
                                                Address:
                                            </p>{" "}
                                            {venue.location.address ||
                                                "Not available"}
                                        </div>
                                        <div className="border-r border-slate-900/50 md:block hidden"></div>
                                        <div className="text-slate-700 truncate">
                                            <p className="font-semibold text-lg">
                                                City:
                                            </p>{" "}
                                            {venue.location.city ||
                                                "Not available"}
                                        </div>
                                    </div>
                                    <div className="border-r border-slate-900/50"></div>
                                    <div className="flex w-full justify-evenly text-center gap-4 md:flex-row flex-col">
                                        <div className="text-slate-700 truncate">
                                            <p className="font-semibold text-lg">
                                                Country:
                                            </p>{" "}
                                            {venue.location.country ||
                                                "Not available"}
                                        </div>
                                        <div className="border-r border-slate-900/50 md:block hidden"></div>
                                        <div className="text-slate-700 truncate">
                                            <p className="font-semibold text-lg">
                                                Zip code:
                                            </p>{" "}
                                            {venue.location.zip ||
                                                "Not available"}
                                        </div>
                                    </div>
                                </div>
                                <div className="relative z-10 h-fit w-full">
                                    <MapDisplay
                                        lat={venue.location.lat}
                                        lng={venue.location.lng}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col w-fit items-center gap-8">
                            <div className="rounded-xl bg-white p-4 w-full shadow-lg flex justify-between items-center gap-4">
                                <div>
                                    <p>This venue is managed by:</p>
                                    <h2 className="text-2xl font-bold text-[#088D9A]">
                                        {venue.owner.name}
                                    </h2>
                                </div>
                                <img
                                    src={
                                        venue.owner.avatar.url ||
                                        "/img/profile.svg"
                                    }
                                    alt={
                                        venue.owner.avatar.alt ||
                                        "A cool profile image"
                                    }
                                    className="h-20 w-20 rounded-full object-cover border-4 border-[#088D9A]"
                                />
                            </div>
                            <div className="flex flex-col bg-white shadow-lg rounded-xl lg:p-4 py-4 w-full max-w-screen">
                                <h2 className="text-xl mb-2 text-center">
                                    <p className="inline font-semibold text-[#088D9A]">
                                        ${venue.price}
                                    </p>{" "}
                                    / Night
                                </h2>
                                <DateRange
                                    editableDateInputs={true}
                                    onChange={(item) => {
                                        const clickedElement =
                                            document.activeElement;
                                        if (
                                            leftCalendar.current?.contains(
                                                clickedElement
                                            )
                                        ) {
                                            setDateRange([
                                                {
                                                    ...dateRange[0],
                                                    startDate:
                                                        item.selection
                                                            .startDate,
                                                },
                                            ]);
                                        } else if (
                                            rightCalendar.current?.contains(
                                                clickedElement
                                            )
                                        ) {
                                            setDateRange([
                                                {
                                                    ...dateRange[0],
                                                    endDate:
                                                        item.selection.endDate,
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
                                    className="mx-auto"
                                />

                                <label className="my-4 mx-auto font-semibold">
                                    Number of guests:
                                    <input
                                        type="number"
                                        value={guests}
                                        min={1}
                                        max={venue.maxGuests}
                                        onChange={(e) =>
                                            setGuests(Number(e.target.value))
                                        }
                                        className="border p-2 rounded ml-4 w-32 font-medium"
                                    />
                                </label>

                                <button
                                    onClick={handleBooking}
                                    className="bg-[#088D9A] text-white px-4 py-2 rounded hover:bg-[#077d89] transition mx-auto w-2/3 cursor-pointer"
                                >
                                    Book Now
                                </button>
                            </div>

                            {isOwner &&
                                localStorage.getItem("venueManager") ==
                                    "true" && (
                                    <>
                                        <Link
                                            to={`/venues/edit/${venueId}`}
                                            className="text-white p-2 text-center bg-[#088D9A] hover:bg-[#077d89] rounded w-2/3 cursor-pointer transition duration-150"
                                            aria-label="Go to Edit this venue"
                                        >
                                            Edit Venue
                                        </Link>
                                    </>
                                )}
                            <div className="flex flex-col flex-wrap">
                                {userBookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="bg-white p-4 my-2 rounded-xl w-fit shadow-lg text-slate-700"
                                    >
                                        <p className="font-bold text-lg text-slate-800">
                                            Your booking:
                                        </p>
                                        <div className="flex justify-between">
                                            <p className="font-semibold">
                                                From:{" "}
                                            </p>
                                            {new Date(
                                                booking.dateFrom
                                            ).toLocaleDateString("en-GB", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}{" "}
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="font-semibold">
                                                To:{" "}
                                            </p>
                                            {new Date(
                                                booking.dateTo
                                            ).toLocaleDateString("en-GB", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}{" "}
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="font-semibold">
                                                Total Nights:{" "}
                                            </p>
                                            {Math.floor(
                                                (new Date(booking.dateTo) -
                                                    new Date(
                                                        booking.dateFrom
                                                    )) /
                                                    (1000 * 60 * 60 * 24)
                                            ) + 1}
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="font-semibold">
                                                Guests:
                                            </p>
                                            {booking.guests}
                                        </div>
                                        <button
                                            className="text-white mt-2 p-2 bg-[#088D9A] hover:bg-[#077d89] rounded w-full cursor-pointer transition duration-150"
                                            onClick={() =>
                                                handleEditClick(booking)
                                            }
                                        >
                                            Edit Booking
                                        </button>
                                        <button
                                            className="text-white mt-2 p-2 bg-red-600 hover:bg-red-700 rounded w-full cursor-pointer transition duration-150"
                                            onClick={() => {
                                                setBookingToDelete(booking.id);
                                                setShowConfirmModal(true);
                                            }}
                                        >
                                            Delete Booking
                                        </button>

                                        {editBookingId === booking.id && (
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    setShowConfirmDialog(true);
                                                }}
                                                className="flex flex-col gap-2"
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
                                                                dateFrom:
                                                                    new Date(
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
                                                                    e.target
                                                                        .value
                                                                ),
                                                            })
                                                        }
                                                        required
                                                        className="border rounded p-1 w-full"
                                                    />
                                                </label>
                                                <button
                                                    type="submit"
                                                    className="text-white mt-2 p-2 bg-[#088D9A] hover:bg-[#077d89] rounded w-full cursor-pointer transition duration-150"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEditBookingId(null)
                                                    }
                                                    className="text-black p-2 bg-gray-300 hover:bg-gray-400 rounded w-full cursor-pointer transition duration-150"
                                                >
                                                    Cancel
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {isOwner && (
                        <h3 className="text-2xl text-center font-semibold text-[#088D9A] py-4">
                            Bookings on your venue
                        </h3>
                    )}
                    <div className="grid lg:grid-cols-3 grid-cols-1 lg:max-w-3xl md:grid-cols-2 md:max-w-1/2 max-w-[320px] gap-4 mx-auto">
                        {isOwner &&
                            venue.bookings?.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="bg-white w-full p-4 my-2 rounded-xl shadow-md text-slate-700 hover:shadow-lg transition duration-150"
                                >
                                    <p className="font-bold text-lg text-slate-800">
                                        Booking from {booking.customer?.name}:
                                    </p>

                                    <div className="flex justify-between">
                                        <p className="font-semibold">From:</p>
                                        {new Date(
                                            booking.dateFrom
                                        ).toLocaleDateString("en-GB", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </div>

                                    <div className="flex justify-between">
                                        <p className="font-semibold">To:</p>
                                        {new Date(
                                            booking.dateTo
                                        ).toLocaleDateString("en-GB", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </div>

                                    <div className="flex justify-between">
                                        <p className="font-semibold">
                                            Total Nights:
                                        </p>
                                        {Math.floor(
                                            (new Date(booking.dateTo) -
                                                new Date(booking.dateFrom)) /
                                                (1000 * 60 * 60 * 24)
                                        ) + 1}
                                    </div>

                                    <div className="flex justify-between">
                                        <p className="font-semibold">Guests:</p>
                                        {booking.guests}
                                    </div>
                                </div>
                            ))}
                    </div>

                    {console.log(venue.bookings)}

                    <dialog
                        ref={dialogRef}
                        className="rounded p-6 w-fit lg:max-w-5xl max-w-screen shadow-xl m-auto"
                    >
                        <h2 className="text-xl font-semibold mb-4 truncate">
                            Confirm Your Booking at{" "}
                            <p className="text-[#088D9A] font-bold">
                                {venue.name}
                            </p>
                        </h2>
                        {checkoutData && (
                            <div className="space-y-2 text-sm text-gray-700 flex flex-col">
                                <p className="flex justify-between">
                                    <strong>From:</strong>{" "}
                                    {new Date(
                                        checkoutData.dateFrom
                                    ).toLocaleDateString("en-GB", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                                <p className="flex justify-between">
                                    <strong>To:</strong>{" "}
                                    {new Date(
                                        checkoutData.dateTo
                                    ).toLocaleDateString("en-GB", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
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
                                    <strong>Guests:</strong>{" "}
                                    {checkoutData.guests}
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
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition duration-150 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await fetch(APIBookings, {
                                            method: "POST",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                                Authorization: `Bearer ${localStorage.getItem(
                                                    "token"
                                                )}`,
                                                "X-Noroff-API-Key": APIKEY,
                                            },
                                            body: JSON.stringify(checkoutData),
                                        });
                                        if (!res.ok) {
                                            if (res.status === 409) {
                                                throw new Error(
                                                    "Booking conflict: No more rooms available / Too many people!"
                                                );
                                            } else if (res.status === 400) {
                                                throw new Error(
                                                    "Bad request: Please check your booking details."
                                                );
                                            } else if (res.status === 401) {
                                                throw new Error(
                                                    "Unauthorized: Please log in."
                                                );
                                            } else {
                                                throw new Error(
                                                    `Booking failed with status ${res.status}`
                                                );
                                            }
                                        }
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
                                        toast.error(
                                            error.message ||
                                                "Booking failed. Please try again."
                                        );
                                    }
                                }}
                                className="px-4 py-2 bg-[#088D9A] text-white rounded hover:bg-[#077d89] transition duration-150 cursor-pointer"
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </dialog>
                    {showConfirmDialog && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
                            <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-sm">
                                <h2 className="text-lg font-bold mb-2">
                                    Confirm Edit
                                </h2>
                                <p className="mb-4">
                                    Are you sure you want to save these booking
                                    changes?
                                </p>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() =>
                                            setShowConfirmDialog(false)
                                        }
                                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleUpdateBooking(
                                                editBookingId,
                                                editData
                                            );
                                            setEditBookingId(null);
                                            setShowConfirmDialog(false);
                                        }}
                                        className="px-4 py-2 bg-[#088D9A] text-white hover:bg-[#077d89] rounded cursor-pointer"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showConfirmModal && (
                        <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center flex flex-col gap-4">
                                <h2 className="text-xl font-bold text-slate-800">
                                    Delete Booking?
                                </h2>
                                <p className="text-slate-600">
                                    Are you sure you want to delete this
                                    booking? This action cannot be undone.
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={() =>
                                            setShowConfirmModal(false)
                                        }
                                        className="bg-gray-300 text-slate-800 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer transition duration-150"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer transition duration-150"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Venue;
