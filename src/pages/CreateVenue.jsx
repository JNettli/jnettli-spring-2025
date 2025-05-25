import { useState } from "react";
import { checkLogin } from "../assets/components/functions";
import { APIVenues } from "../assets/Constants";
import { Link, useNavigate } from "react-router-dom";
import { MapPicker } from "../assets/components/Map";
import { APIKEY } from "../assets/auth";
import { toast, ToastContainer } from "react-toastify";
import { useVenueStore } from "../assets/useVenueStore";
import "react-toastify/dist/ReactToastify.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

function CreateVenue() {
    checkLogin();

    const navigate = useNavigate();
    const { refreshVenueStore } = useVenueStore();
    const profileId = localStorage.getItem("userName");
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        media: [{ url: "" }],
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
            lat: 0,
            lng: 0,
        },
        houseNumber: "",
    });

    const handleLocationSelect = (locationInfo) => {
        setFormData((prev) => ({
            ...prev,
            location: locationInfo,
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim())
            return toast.error("Venue name is required!");
        if (!formData.description.trim())
            return toast.error("Venue description is required!");
        if (!formData.price || formData.price <= 0)
            return toast.error("Price must be greater than 0!");
        if (!formData.maxGuests || formData.maxGuests <= 0)
            return toast.error("Max guests must be greater than 0!");
        if (!formData.location.address)
            return toast.error("Location must be selected on the map!");
        return true;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith("meta.")) {
            const key = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                meta: { ...prev.meta, [key]: checked },
            }));
        } else if (name.startsWith("location.")) {
            const key = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, [key]: value },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "number" ? Number(value) : value,
            }));
        }
    };

    const handleImageChange = (index, value) => {
        setFormData((prev) => {
            const updated = [...prev.media];
            updated[index] = { url: value };
            return { ...prev, media: updated };
        });
    };

    const handleAddImage = () => {
        if (formData.media.length < 8) {
            setFormData((prev) => ({
                ...prev,
                media: [...prev.media, { url: "" }],
            }));
        }
    };

    const handleRemoveImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            media: prev.media.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const filteredMedia = formData.media
            .filter((item) => item.url.trim() !== "")
            .slice(0, 8)
            .map((item, i) => ({
                url: item.url.trim(),
                alt: `Venue image ${i + 1}`,
            }));

        const finalData = {
            ...formData,
            media: filteredMedia,
            location: {
                ...formData.location,
                address: formData.houseNumber
                    ? `${formData.location.address} ${formData.houseNumber}`
                    : formData.location.address,
            },
        };

        try {
            const res = await fetch(APIVenues, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "X-Noroff-API-Key": APIKEY,
                },
                body: JSON.stringify(finalData),
            });

            if (!res.ok) throw new Error("Failed to create venue");

            const createdVenue = await res.json();
            refreshVenueStore(createdVenue.data);

            setFormData({
                name: "",
                description: "",
                media: [{ url: "" }],
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
                    lat: 0,
                    lng: 0,
                },
                houseNumber: "",
            });

            toast.success(
                <>
                    Venue Created! <br />
                    Going to profile, please wait...
                </>
            );
            setTimeout(() => navigate(`/profile/${profileId}`), 2000);
        } catch (error) {
            console.error("Venue creation error:", error);
            toast.error(error.message || "Something went wrong!");
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 pt-2">
            <ToastContainer position="top-center" autoClose={3000} />
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-10">
                <Link
                    to={`/profile/${profileId}`}
                    className="text-[#088D9A] hover:underline text-sm"
                >
                    ← Back to Profile
                </Link>

                <h1 className="text-3xl font-bold text-[#088D9A] mt-4 mb-6">
                    Create New Venue
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-lg font-medium text-slate-700 mb-1">
                                Venue Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Venue Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full border border-slate-900/50 shadow-md rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#088D9A]"
                            />
                        </div>

                        <div>
                            <label className="text-lg font-medium text-slate-700 mb-1">
                                Max Guests
                            </label>
                            <div className="relative">
                                <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                                    <img
                                        src="/img/profile.svg"
                                        alt="guest image"
                                        className="max-h-5 max-w-5"
                                    />
                                </span>
                                <input
                                    type="number"
                                    name="maxGuests"
                                    min="1"
                                    max="100"
                                    placeholder="Max Guests"
                                    value={formData.maxGuests}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-slate-900/50 shadow-md rounded-md pl-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#088D9A]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-lg font-medium text-slate-700 mb-1">
                                Rating (1-5)
                            </label>
                            <input
                                type="number"
                                name="rating"
                                min="0"
                                max="5"
                                placeholder="Rating"
                                value={formData.rating}
                                onChange={handleChange}
                                className="w-full border border-slate-900/50 shadow-md rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#088D9A]"
                            />
                        </div>

                        <div>
                            <label className="text-lg font-medium text-slate-700 mb-1">
                                Price per night
                            </label>
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
                                    className="w-full border border-slate-900/50 shadow-md rounded pl-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#088D9A]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 border border-slate-900/50 p-4 rounded-lg flex flex-col gap-4 shadow-md">
                        <label className="text-lg font-semibold text-slate-700 bg-white">
                            Image URL (up to 8)
                        </label>
                        {formData.media.map((img, index) => (
                            <div key={index} className="flex">
                                <input
                                    type="url"
                                    placeholder={`Image URL ${index + 1}`}
                                    value={img.url}
                                    onChange={(e) =>
                                        handleImageChange(index, e.target.value)
                                    }
                                    className="w-full border border-slate-900 shadow-md px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#088D9A]"
                                    required
                                />
                                {formData.media.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="text-red-500 hover:text-red-700 cursor-pointer text-xl font-bold p-2"
                                        title="Remove image"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={handleAddImage}
                            disabled={formData.media.length >= 8}
                            className={`mt-2 px-4 py-2 rounded w-48 mx-auto ${
                                formData.media.length >= 8
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                            }`}
                        >
                            Add another image
                        </button>
                    </div>

                    <div>
                        <label className="text-lg font-medium text-slate-700 mb-1">
                            Venue Description
                        </label>
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="w-full border h-32 border-slate-900/50 shadow-md rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#088D9A]"
                        />
                    </div>

                    <fieldset className="border border-slate-900/50 p-4 rounded">
                        <legend className="text-lg font-semibold">
                            Amenities
                        </legend>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.keys(formData.meta).map((key) => (
                                <label
                                    key={key}
                                    className="flex items-center gap-2 cursor-pointer border border-slate-900/50 hover:outline-2 hover:outline-[#088D9A] rounded p-2"
                                >
                                    <img
                                        src={
                                            formData.meta[key]
                                                ? "/img/positive.svg"
                                                : "/img/neutral.svg"
                                        }
                                        alt="checkbox"
                                        className="h-6 w-6"
                                    />
                                    <input
                                        type="checkbox"
                                        name={`meta.${key}`}
                                        checked={formData.meta[key]}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <fieldset className="border border-slate-900/50 shadow-md rounded-md p-4">
                        <legend className="font-semibold text-lg text-slate-800">
                            Location
                        </legend>
                        <p className="-mt-2 mb-4 text-slate-600">
                            Click your venue on the map to fill in location
                            details.
                        </p>

                        <MapPicker onLocationSelect={handleLocationSelect} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <input
                                type="text"
                                placeholder="Address"
                                value={formData.location.address}
                                readOnly
                                className="border border-slate-900/50 shadow-md rounded-md px-3 py-2 bg-gray-100"
                            />
                            <input
                                type="text"
                                placeholder="House Number"
                                value={formData.location.houseNumber}
                                readOnly
                                className="border border-slate-900/50 shadow-md rounded-md px-3 py-2 bg-gray-100"
                            />
                            <input
                                type="text"
                                placeholder="City"
                                value={formData.location.city}
                                readOnly
                                className="border border-slate-900/50 shadow-md rounded-md px-3 py-2 bg-gray-100"
                            />
                            <input
                                type="text"
                                placeholder="Zip Code"
                                value={formData.location.zip}
                                readOnly
                                className="border border-slate-900/50 shadow-md rounded-md px-3 py-2 bg-gray-100"
                            />
                            <input
                                type="text"
                                placeholder="Country"
                                value={formData.location.country}
                                readOnly
                                className="border border-slate-900/50 shadow-md rounded-md px-3 py-2 bg-gray-100"
                            />
                        </div>
                    </fieldset>

                    <button
                        type="submit"
                        className="w-full bg-[#088D9A] text-white py-3 rounded-md hover:bg-[#077d89] cursor-pointer transition"
                    >
                        Create Venue
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateVenue;
