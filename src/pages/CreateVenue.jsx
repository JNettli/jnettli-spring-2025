import { useState } from "react";
import { checkLogin } from "../assets/components/functions";
import { APIVenues } from "../assets/Constants";
import { Link, useNavigate } from "react-router-dom";
import { MapPicker } from "../assets/components/Map";
import { APIKEY } from "../assets/auth";

function CreateVenue() {
    checkLogin();

    const navigate = useNavigate();
    const profileId = localStorage.getItem("userName");
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        media: {
            url: "",
        },
        price: 0,
        maxGuests: 1,
        rating: 0,
        meta: {
            wifi: false,
            parking: false,
            breakfast: false,
            pets: false,
        },
        houseNumber: "",
        location: {
            address: "",
            city: "",
            zip: "",
            country: "",
            lat: 0,
            lng: 0,
        },
    });

    const handleLocationSelect = (locationInfo) => {
        setFormData((prev) => ({
            ...prev,
            location: locationInfo,
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes("meta.")) {
            const metaField = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                meta: {
                    ...prev.meta,
                    [metaField]: checked,
                },
            }));
        } else if (name.includes("location.")) {
            const locField = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                location: {
                    ...prev.location,
                    [locField]: value,
                },
            }));
        } else if (name.includes("media.")) {
            const mediaField = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                media: {
                    ...prev.media,
                    [mediaField]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "number" ? Number(value) : value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalFormData = {
            ...formData,
            media: formData.media.url ? [{ url: formData.media.url }] : [],
            location: {
                ...formData.location,
                address: formData.houseNumber
                    ? `${formData.location.address} ${formData.houseNumber}`
                    : formData.location.address,
            },
        };
        console.log(finalFormData);

        try {
            const res = await fetch(APIVenues, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "X-Noroff-API-Key": APIKEY,
                },
                body: JSON.stringify(finalFormData),
            });

            if (!res.ok) {
                throw new Error("Failed to create venue");
            }

            setFormData({
                name: "",
                description: "",
                media: {
                    url: "",
                },
                price: 0,
                maxGuests: 1,
                rating: 0,
                meta: {
                    wifi: false,
                    parking: false,
                    breakfast: false,
                    pets: false,
                },
                location: {
                    address: "",
                    city: "",
                    zip: "",
                    country: "",
                    continent: "",
                    lat: 0,
                    lng: 0,
                },
            });
            navigate(`/profile/${profileId}`);
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow-md">
            <Link to={"/profile/" + profileId}>&#x21a9; Back to Profile</Link>
            <h1 className="text-2xl font-bold mb-4">Create New Venue</h1>

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
                    <p>
                        Click on the map to get address. Remember to add house
                        number!
                    </p>
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
                        name="houseNumber"
                        value={formData.houseNumber}
                        onChange={handleChange}
                        className="border p-2 rounded"
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
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Create Venue
                </button>
            </form>
        </div>
    );
}

export default CreateVenue;
