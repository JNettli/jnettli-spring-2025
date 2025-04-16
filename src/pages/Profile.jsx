import { Link } from "react-router-dom";

function Profile() {
    return (
        <>
            <div className="flex justify-center">
                <div className="bg-white max-w-7xl min-w-5xl">
                    <p className="text-lg">Profile Page</p>
                    <Link to={"/profile/edit"}>Edit Profile!</Link>
                </div>
            </div>
        </>
    );
}

export default Profile;
