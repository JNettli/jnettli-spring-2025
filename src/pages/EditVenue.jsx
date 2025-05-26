import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { APIVenues } from "../assets/Constants";
import { APIKEY } from "../assets/auth";
import { MapPicker } from "../assets/components/Map";
import { useVenueStore } from "../assets/useVenueStore";
import { toast } from "react-toastify";
import { checkLogin } from "../assets/components/functions";

function EditVenue() {
    const { venueId } = useParams();
    const profileId = localStorage.getItem("userName");
    useEffect(() => {
        if (!profileId) {
            checkLogin();
        }
    });
    const navigate = useNavigate();
    const refreshVenueStore = useVenueStore((state) => state.refreshVenueStore);

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
        media: [{ url: "" }],
        meta: {
            wifi: undefined,
            parking: undefined,
            breakfast: undefined,
            pets: undefined,
        },
        name: "",
        price: 0,
        rating: 0,
    });

    const [loading, setLoading] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

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
                    media: venue.media?.map((m) => m.url) || [],
                    meta: {
                        wifi: venue.meta.wifi || undefined,
                        parking: venue.meta.parking || undefined,
                        breakfast: venue.meta.breakfast || undefined,
                        pets: venue.meta.pets || undefined,
                    },
                    name: venue.name || "",
                    price: venue.price || 0,
                    rating: venue.rating || 0,
                });
            } catch (error) {
                console.error("Error loading venue:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchVenue();
    }, [venueId]);
    const handleMediaChange = (index, value) => {
        setFormData((prev) => {
            const newMedia = [...prev.media];
            newMedia[index] = value;
            return { ...prev, media: newMedia };
        });
    };

    const addMediaInput = () => {
        if (formData.media.length < 8) {
            setFormData((prev) => ({
                ...prev,
                media: [...prev.media, ""],
            }));
        }
    };

    const removeMediaInput = (index) => {
        setFormData((prev) => {
            const newMedia = [...prev.media];
            newMedia.splice(index, 1);
            return { ...prev, media: newMedia };
        });
    };

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
                    media: formData.media
                        .filter((url) => url.trim() !== "")
                        .map((url) => ({ url })),
                    meta: formData.meta,
                    location: formData.location,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to update venue");
            }

            toast.success("Venue Updated!");
            await refreshVenueStore();

            setTimeout(() => {
                navigate(`/venue/${venueId}`);
            }, 2500);
        } catch (error) {
            console.error("Update error:", error);
            toast.error("An error occurred while updating the venue.");
        }
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch(`${APIVenues}/${venueId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "X-Noroff-API-Key": APIKEY,
                },
            });

            if (!res.ok) throw new Error("Failed to delete venue");

            toast.success(
                <>
                    Venue Deleted. <br />
                    Sending you to home page...
                </>
            );
            setTimeout(() => {
                navigate(`/profile/${localStorage.getItem("userName")}`);
            }, 2500);
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("An error occurred while deleting the venue.");
        } finally {
            setShowConfirmModal(false);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen text-[#088D9A] font-semibold">
                Loading venue...
            </div>
        );

    return (
        <div className="flex justify-center mt-6 px-4">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 w-full max-w-3xl rounded-xl shadow-md p-6 bg-white"
            >
                <Link
                    to={`/venue/${formData.id}`}
                    className="text-[#088D9A] hover:underline text-sm w-fit"
                    aria-label="Go back to the venue"
                >
                    ← Back to Venue
                </Link>
                <h2 className="text-3xl font-bold text-[#088D9A] mb-4">
                    Edit Venue
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="block">
                        <span className="text-slate-700 font-semibold mb-1 block">
                            Venue Name
                        </span>
                        <input
                            type="text"
                            name="name"
                            placeholder="Venue Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-slate-900/50 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#088D9A]"
                        />
                    </label>

                    <label className="relative">
                        <span className="text-slate-700 font-semibold mb-1">
                            Max Guest Amount
                        </span>
                        <span className="absolute left-2 top-8.5 transform">
                            <img
                                src="/img/profile.svg"
                                alt="guest amount"
                                className="max-h-5 max-w-5"
                            />
                        </span>
                        <input
                            type="number"
                            name="maxGuests"
                            placeholder="Max Guests"
                            value={formData.maxGuests}
                            onChange={handleChange}
                            required
                            className="w-full border border-slate-900/50 p-2 pl-8 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#088D9A]"
                        />
                    </label>

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

                    <label className="relative">
                        <span className="text-slate-700 font-semibold mb-1">
                            Price per night
                        </span>
                        <span className="absolute left-3 top-9 text-gray-500 select-none">
                            $
                        </span>
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className="w-full border border-slate-900/50 p-2 pl-8 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#088D9A]"
                        />
                    </label>
                </div>

                <fieldset className="border border-slate-900/50 p-4 rounded shadow-sm flex flex-col">
                    <legend className="text-slate-700 text-lg font-semibold mb-2">
                        Image URLs (max 8)
                    </legend>

                    {formData.media.map((url, index) => (
                        <div key={index} className="flex mb-2 space-x-2">
                            <input
                                type="url"
                                value={url}
                                onChange={(e) =>
                                    handleMediaChange(index, e.target.value)
                                }
                                placeholder={`Image URL #${index + 1}`}
                                className="flex-grow border border-slate-900/50 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#088D9A]"
                            />
                            {formData.media.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeMediaInput(index)}
                                    className="text-red-600 font-bold hover:text-red-800 text-2xl cursor-pointer"
                                    aria-label={`Remove image URL #${
                                        index + 1
                                    }`}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}

                    {formData.media.length <= 8 && (
                        <button
                            type="button"
                            onClick={addMediaInput}
                            className={`mt-2 px-4 py-2 rounded w-48 mx-auto ${
                                formData.media.length >= 8
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                            }`}
                        >
                            Add Another Image
                        </button>
                    )}
                </fieldset>

                <label className="block">
                    <span className="text-slate-700 font-semibold mb-1 block">
                        Venue Description
                    </span>
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="w-full min-h-48 border border-slate-900/50 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#088D9A]"
                    />
                </label>

                <fieldset className="border border-slate-900/50 p-4 rounded">
                    <legend className="text-lg text-slate-700 font-semibold">
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

                <fieldset className="border border-slate-900/50 p-4 rounded shadow-sm flex flex-col gap-4">
                    <legend className="text-slate-700 text-lg font-semibold">
                        Location
                    </legend>
                    <h3 className="text-center text-xl font-bold text-[#088D9A]">
                        Click your venue on the map!
                    </h3>
                    <div className="relative z-10">
                        <MapPicker
                            initialLat={formData.location.lat}
                            initialLng={formData.location.lng}
                            zoom={13}
                            onLocationSelect={handleLocationSelect}
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Address"
                        value={formData.location.address}
                        readOnly
                        className="border border-slate-900/50 p-2 rounded bg-gray-100"
                    />
                    <input
                        type="text"
                        placeholder="City"
                        value={formData.location.city}
                        readOnly
                        className="border border-slate-900/50 p-2 rounded bg-gray-100"
                    />
                    <input
                        type="text"
                        placeholder="Zip Code"
                        value={formData.location.zip}
                        readOnly
                        className="border border-slate-900/50 p-2 rounded bg-gray-100"
                    />
                    <input
                        type="text"
                        placeholder="Country"
                        value={formData.location.country}
                        readOnly
                        className="border border-slate-900/50 p-2 rounded bg-gray-100"
                    />
                </fieldset>

                <div className="flex gap-4 mt-4">
                    <button
                        type="submit"
                        className="bg-[#088D9A] text-white px-6 py-2 rounded shadow-md hover:shadow-lg transition cursor-pointer"
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowConfirmModal(true)}
                        className="bg-red-600 text-white px-6 py-2 rounded shadow-md hover:shadow-lg transition cursor-pointer"
                    >
                        Delete Venue
                    </button>
                </div>
            </form>
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center flex flex-col gap-4">
                        <h2 className="text-xl font-bold text-slate-800">
                            Delete Venue?
                        </h2>
                        <p className="text-slate-600">
                            Are you sure you want to delete this venue? This
                            action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowConfirmModal(false)}
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
    );
}

export default EditVenue;
