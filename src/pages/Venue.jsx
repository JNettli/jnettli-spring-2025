import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { APIBookings, APIVenues } from "../assets/Constants";
import { MapDisplay } from "../assets/components/Map";
import { DateRange } from "react-date-range";
import { eachDayOfInterval } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

function Venue() {
    const { venueId } = useParams();
    const [venue, setVenue] = useState(null);
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
            <h2 className="text-xl font-bold mt-6 mb-2">Pick your date</h2>
            <DateRange
                editableDateInputs={true}
                onChange={(item) => setDateRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                disabledDates={disabledDates}
                months={2}
                direction="horizontal"
                minDate={new Date()}
            />
            {console.log(dateRange)}
            <MapDisplay lat={venue.location.lat} lng={venue.location.lng} />
        </div>
    );
}

export default Venue;
