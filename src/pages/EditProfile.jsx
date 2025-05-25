import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { APIProfile } from "../assets/Constants";
import { APIKEY } from "../assets/auth";
import { ToastContainer, toast } from "react-toastify";

function EditProfile() {
    const profileId = localStorage.getItem("userName");
    const navigate = useNavigate();
    useEffect(() => {
        if (!profileId) {
            toast.info("You need to be logged in to view this page!");
            navigate("/");
        }
    });
    const [formData, setFormData] = useState({
        bio: "",
        name: "",
        email: "",
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
                    name: profile.name || "",
                    email: profile.email || "",
                    avatarUrl:
                        profile.avatar?.url ||
                        "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=400&w=400",
                    bannerUrl:
                        profile.banner?.url ||
                        "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=500&w=1500",
                    venueManager: !!profile.venueManager,
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

        if (name === "venueManager") {
            if (value === "false" && formData.venueManager === true) {
                toast.info("You cannot edit or create venues as a user");
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: name === "venueManager" ? value === "true" : value,
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
                    venueManager: formData.venueManager,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to update profile");
            }

            localStorage.setItem(
                "venueManager",
                formData.venueManager.toString()
            );

            toast.success("Profile updated!");
            setTimeout(() => {
                navigate(`/profile/${profileId}`);
            }, 2000);
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Update error: ", error);
        }
    };

    if (loading) return <div>Loading profile...</div>;

    return (
        <div className="flex lg:flex-row flex-col-reverse lg:items-start items-center justify-center gap-8 mt-4">
            <ToastContainer position="top-center" autoClose={3000} />
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl space-y-4"
            >
                <Link
                    to={`/venue/${formData.id}`}
                    className="text-[#088D9A] hover:underline text-sm w-fit"
                    aria-label="Go back to the profile"
                >
                    ← Back to Profile
                </Link>
                <h2 className="text-3xl text-[#088D9A] mt-2 font-semibold">
                    Edit Profile
                </h2>
                <label>
                    <p className="text-lg mt-2 text-slate-700">
                        Bio: (Max 160 characters)
                    </p>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full p-2 border border-slate-900/50 rounded"
                        rows={4}
                        maxLength={160}
                    />
                </label>

                <label>
                    <p className="text-lg mt-2 text-slate-700">Avatar URL:</p>
                    <input
                        name="avatarUrl"
                        value={formData.avatarUrl}
                        onChange={handleChange}
                        className="w-full p-2 border border-slate-900/50 rounded"
                        type="url"
                    />
                </label>

                <label>
                    <p className="text-lg mt-2 text-slate-700">Banner URL:</p>
                    <input
                        name="bannerUrl"
                        value={formData.bannerUrl}
                        onChange={handleChange}
                        className="w-full p-2 border border-slate-900/50 rounded"
                        type="url"
                    />
                </label>

                <p className="text-lg mt-2 mb-0 text-slate-700">User Type:</p>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-4">
                        <label className="cursor-pointer flex gap-2 border border-slate-900/50 rounded p-2">
                            <input
                                type="radio"
                                name="venueManager"
                                value="false"
                                checked={formData.venueManager === false}
                                onChange={handleChange}
                                className="false"
                            />
                            <img
                                src={
                                    formData.venueManager === false
                                        ? "/img/positive.svg"
                                        : "/img/negative.svg"
                                }
                                alt="User"
                                className="w-6 h-6 transition duration-200"
                            />
                            User
                        </label>

                        <label className="cursor-pointer flex gap-2 border border-slate-900/50 rounded p-2">
                            <input
                                type="radio"
                                name="venueManager"
                                value="true"
                                checked={formData.venueManager === true}
                                onChange={handleChange}
                                className=""
                            />
                            <img
                                src={
                                    formData.venueManager === true
                                        ? "/img/positive.svg"
                                        : "/img/negative.svg"
                                }
                                alt="Venue Manager"
                                className="w-6 h-6 transition duration-200"
                            />
                            Venue Manager
                        </label>
                    </div>
                    <p className="text-slate-400 -mb-6">
                        Hint: You get a cool badge when you're a venue manager!
                    </p>
                </div>

                <button
                    type="submit"
                    className="bg-[#007A8D] text-white px-4 py-2 mt-4 rounded hover:bg-[#006473] transition duration-150 cursor-pointer"
                >
                    Save Changes
                </button>
            </form>

            <div>
                <h2 className="text-xl font-semibold text-[#007A8D] text-center mb-2">
                    Profile Card Preview
                </h2>
                <div className="max-w-[360px] rounded-xl bg-white py-8 px-2 shadow-lg flex gap-2 relative">
                    <img
                        src={formData.bannerUrl}
                        alt="Avatar Preview"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/img/error-image.svg";
                        }}
                        className="w-full h-1/2 rounded-t-xl absolute top-0 left-0 max-w-full object-cover"
                    />
                    <div className="flex flex-col gap-2 pl-2 w-fit">
                        <img
                            src={formData.avatarUrl}
                            alt="Banner Preview"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/img/error-image.svg";
                            }}
                            className="h-24 w-24 max-h-24 max-w-24 object-cover relative rounded-full border-4 border-[#088D9A] shadow-md"
                        />
                        <h1 className="text-center text-2xl font-bold text-[#088D9A]">
                            {formData.name}
                        </h1>
                    </div>
                    <div className="flex flex-col justify-end py-1">
                        <div>
                            <p className="text-slate-600">{formData.email}</p>
                            {formData.venueManager ? (
                                <img
                                    src="/img/manager.svg"
                                    alt="Manager Badge"
                                    title="Manager Badge"
                                    className="h-8 w-8 absolute top-1 right-1"
                                />
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;
