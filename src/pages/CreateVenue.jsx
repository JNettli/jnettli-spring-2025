import { Link } from "react-router-dom";

function CreateVenue() {
    return (
        <>
            <div className="flex justify-center">
                <div className="bg-white max-w-7xl min-w-5xl">
                    <p className="text-lg">Create Venue!</p>
                    <Link to={"/"}>Back to home page!</Link>
                </div>
            </div>
        </>
    );
}

export default CreateVenue;
