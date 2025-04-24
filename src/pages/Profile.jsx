import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { APIProfile } from "../assets/Constants";
import { APIKEY } from "../assets/auth";

function Profile() {
    const profileId = localStorage.getItem("userName");
    const profileMail = localStorage.getItem("userId");
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!profileId) return;

        async function fetchProfile() {
            try {
                const res = await fetch(APIProfile + "/" + profileId, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        "X-Noroff-API-Key": APIKEY,
                    },
                });
                const data = await res.json();
                document.title =
                    data.data.name +
                    " | Holidaze " +
                    (data.data.venueManager ? "Venue Manager" : "User");
                setProfile(data.data);
            } catch (error) {
                console.error("Error fetching venue:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [profileId]);

    const editProfile = "/profile/edit/" + profileMail;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!profile) {
        return <div>Error: Profile not found.</div>;
    }

    return (
        <div className="flex justify-center">
            <div className="bg-white max-w-7xl min-w-5xl">
                <p className="text-lg">Profile Page</p>
                <img src={profile.banner.url} alt={profile.banner.alt} />
                <img
                    src={profile.avatar.url}
                    alt={profile.avatar.alt}
                    className="h-48 w-48 object-cover rounded-full"
                />
                <p>{profile.name}</p>
                <p>{profile.email}</p>
                <p>{profile.bio}</p>
                <p className="mb-2">{profile.venueManager ? "Yes" : "No"}</p>
                <Link
                    to={editProfile}
                    className="bg-blue-300 px-4 py-2 rounded"
                >
                    Edit Profile!
                </Link>
                <Link
                    to={"/create"}
                    className="bg-blue-500 px-4 py-2 rounded ml-2"
                >
                    Create Venue
                </Link>
            </div>
        </div>
    );
}

export default Profile;
