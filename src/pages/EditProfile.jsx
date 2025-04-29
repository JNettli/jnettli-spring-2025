import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIProfile } from "../assets/Constants";
import { APIKEY } from "../assets/auth";

function EditProfile() {
    const profileId = localStorage.getItem("userName");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        bio: "",
        avatarUrl: "",
        bannerUrl: "",
        venueManager: false,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch(`${APIProfile}/${profileId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        "X-Noroff-API-Key": APIKEY,
                    },
                });
                const data = await res.json();
                const profile = data.data;

                setFormData({
                    bio: profile.bio || "",
                    avatarUrl:
                        profile.avatar?.url ||
                        "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=400&w=400",
                    bannerUrl:
                        profile.banner?.url ||
                        "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=500&w=1500",
                    venueManager: profile.venueManager || "false",
                });
            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [profileId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedValue =
            name === "profileManager" ? value === "true" : value;
        setFormData((prev) => ({
            ...prev,
            [name]: updatedValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${APIProfile}/${profileId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "X-Noroff-API-Key": APIKEY,
                },
                body: JSON.stringify({
                    bio: formData.bio,
                    avatar: {
                        url: formData.avatarUrl,
                    },
                    banner: {
                        url: formData.bannerUrl,
                    },
                    venueManager: formData.profileManager,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to update profile");
            }

            alert("Profile updated!");
            navigate(`/profile/${profileId}`);
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    if (loading) return <div>Loading profile...</div>;

    return (
        <div className="flex justify-center mt-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl space-y-4"
            >
                <h2 className="text-2xl font-semibold">Edit Profile</h2>

                <label>
                    Bio: (Max 160 characters)
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        rows={5}
                        maxLength={160}
                    />
                </label>

                <label>
                    Avatar URL:
                    <input
                        name="avatarUrl"
                        value={formData.avatarUrl}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        type="url"
                    />
                </label>

                <label>
                    Banner URL:
                    <input
                        name="bannerUrl"
                        value={formData.bannerUrl}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        type="url"
                    />
                </label>

                <select
                    name="profileManager"
                    value={formData.profileManager}
                    onChange={handleChange}
                    className="w-full px-3 py-2 mt-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select user type</option>
                    <option value="false">User</option>
                    <option value="true">Venue Manager</option>
                </select>

                <button
                    type="submit"
                    className="bg-[#007A8D] text-white px-4 py-2 mt-4 rounded hover:bg-[#006473] transition"
                >
                    Save Changes
                </button>
            </form>

            <div className="mb-4">
                <img
                    src={
                        formData.avatarUrl?.trim()
                            ? formData.avatarUrl
                            : "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=400&w=400"
                    }
                    alt="Avatar Preview"
                    className="h-32 w-32 object-cover rounded-full mt-2 border"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/img/error-image.svg";
                    }}
                />
            </div>

            <div className="mb-4">
                <img
                    src={
                        formData.bannerUrl?.trim()
                            ? formData.bannerUrl
                            : "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=500&w=1500"
                    }
                    alt="Banner Preview"
                    className="w-full h-48 object-cover mt-2 border"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/img/error-image.svg";
                    }}
                />
            </div>
        </div>
    );
}

export default EditProfile;
