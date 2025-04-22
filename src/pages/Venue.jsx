import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { APIVenues } from "../assets/Constants";

function Venue() {
    const { venueId } = useParams();
    const [venue, setVenue] = useState(null);

    useEffect(() => {
        if (!venueId) return;

        async function fetchVenue() {
            try {
                const res = await fetch(APIVenues + "/" + venueId);
                const data = await res.json();
                console.log(data.data);
                document.title = "Holidaze - " + data.data.name;
                setVenue(data.data);
            } catch (error) {
                console.error("Error fetching venue:", error);
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
            <p>Latitude: {venue.location.lat}</p>
            <p>Longitude: {venue.location.lng}</p>
            <p>Zip code: {venue.location.zip}</p>
            <p>Max Guests: {venue.maxGuests}</p>
            <p>Wifi: {venue.meta.wifi ? "Yes" : "No"}</p>
            <p>Breakfast: {venue.meta.breakfast ? "Yes" : "No"}</p>
            <p>Pets: {venue.meta.pets ? "Yes" : "No"}</p>
            <p>Parking: {venue.meta.parking ? "Yes" : "No"}</p>
        </div>
    );
}

export default Venue;
