import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { APIVenues } from "../assets/Constants";
import { APIKEY } from "../assets/auth";
import { MapPicker } from "../assets/components/Map";

function EditVenue() {
    const { venueId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        description: "",
        location: {
            address: "",
            city: "",
            country: "",
            lat: 0,
            lng: 0,
            zip: "",
        },
        maxGuests: 0,
        media: {
            url: "",
        },
        meta: {
            wifi: undefined,
            parking: undefined,
            breakfast: undefined,
            pets: undefined,
        },
        name: "",
        price: 0,
    });
    const [loading, setLoading] = useState(true);

    const handleLocationSelect = (locationInfo) => {
        setFormData((prev) => ({
            ...prev,
            location: locationInfo,
        }));
    };

    useEffect(() => {
        async function fetchVenue() {
            try {
                const res = await fetch(`${APIVenues}/${venueId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        "X-Noroff-API-Key": APIKEY,
                    },
                });
                const data = await res.json();
                const venue = data.data;
                console.log(venue);

                setFormData({
                    description: venue.description || "",
                    location: {
                        address: venue.location.address || "",
                        city: venue.location.city || "",
                        country: venue.location.country || "",
                        lat: venue.location.lat || 0,
                        lng: venue.location.lng || 0,
                        zip: venue.location.zip || "",
                    },
                    maxGuests: venue.maxGuests || 0,
                    media: {
                        url: venue.media[0].url || "",
                    },
                    meta: {
                        wifi: venue.meta.wifi || undefined,
                        parking: venue.meta.parking || undefined,
                        breakfast: venue.meta.breakfast || undefined,
                        pets: venue.meta.pets || undefined,
                    },
                    name: venue.name || "",
                    price: venue.price || 0,
                });
            } catch (error) {
                console.error("Error loading venue:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchVenue();
    }, [venueId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === "checkbox" ? checked : value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${APIVenues}/${venueId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "X-Noroff-API-Key": APIKEY,
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    price: Number(formData.price),
                    maxGuests: Number(formData.maxGuests),
                    media: [
                        {
                            url: formData.media.url,
                        },
                    ],
                    meta: formData.meta,
                    location: formData.location,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to update venue");
            }

            alert("Venue updated!");
            navigate(`/venues/${venueId}`);
        } catch (error) {
            console.error("Update error:", error);
            alert("An error occurred while updating the venue.");
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this venue?"
        );
        if (!confirmed) return;

        try {
            const res = await fetch(`${APIVenues}/${venueId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "X-Noroff-API-Key": APIKEY,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to delete venue");
            }

            alert("Venue deleted.");
            navigate(`/profile/${localStorage.getItem("userName")}`);
        } catch (error) {
            console.error("Delete error:", error);
            alert("An error occurred while deleting the venue.");
        }
    };

    if (loading) return <div>Loading profile...</div>;

    return (
        <div className="flex justify-center mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <label>
                    Venue Name
                    <input
                        type="text"
                        name="name"
                        placeholder="Venue Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </label>
                <label>
                    Venue Description
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </label>
                <label>
                    Image URL
                    <input
                        type="url"
                        name="media.url"
                        placeholder="Image URL"
                        value={formData.media.url}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </label>
                <label>
                    Price per night
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            $
                        </span>
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 pl-8 rounded"
                        />
                    </div>
                </label>
                <label>
                    Max Guest Amount
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            &#x2603;
                        </span>
                        <input
                            type="number"
                            name="maxGuests"
                            placeholder="Max Guests"
                            value={formData.maxGuests}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 pl-8 rounded"
                        />
                    </div>
                </label>

                <fieldset className="border p-2 rounded">
                    <legend className="text-lg font-semibold">Amenities</legend>
                    {["wifi", "parking", "breakfast", "pets"].map((key) => (
                        <label key={key} className="block">
                            <input
                                type="checkbox"
                                name={`meta.${key}`}
                                checked={formData.meta[key]}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                    ))}
                </fieldset>

                <fieldset className="border p-2 rounded flex flex-col gap-4">
                    <legend className="text-lg font-semibold">Location</legend>
                    <h3 className="text-center text-xl font-bold">
                        Click your venue on the map!
                    </h3>
                    <MapPicker onLocationSelect={handleLocationSelect} />

                    <input
                        type="text"
                        placeholder="Address"
                        value={formData.location.address}
                        readOnly
                        className="border p-2 rounded bg-gray-100"
                    />
                    <input
                        type="text"
                        placeholder="House Number"
                        value={formData.location.houseNumber}
                        readOnly
                        className="border p-2 rounded bg-gray-100"
                    />

                    <input
                        type="text"
                        placeholder="City"
                        value={formData.location.city}
                        readOnly
                        className="border p-2 rounded bg-gray-100"
                    />
                    <input
                        type="text"
                        placeholder="Zip Code"
                        value={formData.location.zip}
                        readOnly
                        className="border p-2 rounded bg-gray-100"
                    />
                    <input
                        type="text"
                        placeholder="Country"
                        value={formData.location.country}
                        readOnly
                        className="border p-2 rounded bg-gray-100"
                    />
                </fieldset>

                <button
                    type="submit"
                    className="bg-[#007A8D] text-white px-4 py-2 mt-4 rounded hover:bg-[#006473] transition"
                >
                    Save Changes
                </button>
                <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-4 py-2 mt-2 ml-8 rounded hover:bg-red-700 transition"
                >
                    Delete Venue
                </button>
            </form>
        </div>
    );
}

export default EditVenue;
