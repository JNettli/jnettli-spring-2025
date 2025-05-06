import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { APIBookings, APIVenues } from "../assets/Constants";
import { MapDisplay } from "../assets/components/Map";
import { DateRange } from "react-date-range";
import { eachDayOfInterval } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { APIKEY } from "../assets/auth";

function Venue() {
    const { venueId } = useParams();
    const [venue, setVenue] = useState(null);
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
                console.log(data.data);
                document.title = data.data.name + " | Holidaze";
                setVenue(data.data);
                setBookedDates(data.data.bookings);
            } catch (error) {
                console.error("Error fetching venue or bookings:", error);
            }
        }

        fetchVenue();
    }, [venueId]);

    if (!venueId) return <p>No venue ID provided.</p>;

    if (!venue) return <p>Loading venue...</p>;

    return (
        <div>
            <img src={venue.media[0].url} alt={venue.media[0].alt} />
            <h1>{venue.name}</h1>
            <p>{venue.description}</p>
            <p>Price per night: {venue.price}$</p>
            <p>Rating: {venue.rating}⭐</p>
            <p>Currently booked: {venue._count.bookings}</p>
            <p>Address: {venue.location.address}</p>
            <p>City: {venue.location.city}</p>
            <p>Country: {venue.location.country}</p>
            <p>Zip code: {venue.location.zip}</p>
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
                    className="border p-2 rounded w-full"
                />
            </label>
            <h2 className="text-xl font-bold mt-6 mb-2">Pick your date</h2>
            <div className="flex justify-between px-4 text-sm font-semibold text-gray-600">
                <span>Start Date</span>
                <span>End Date</span>
            </div>
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
                months={2}
                direction="horizontal"
                minDate={new Date()}
            />
            <button
                onClick={handleBooking}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Book Now
            </button>

            <MapDisplay lat={venue.location.lat} lng={venue.location.lng} />
        </div>
    );
}

export default Venue;
