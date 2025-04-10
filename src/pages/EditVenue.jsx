import { Link } from "react-router-dom";

function EditVenue() {
    return (
        <>
            <div className="flex justify-center">
                <div className="bg-white max-w-7xl min-w-5xl">
                    <p className="text-lg">Edit Venue</p>
                    <Link to={"/checkout"}>Checkout!</Link>
                </div>
            </div>
        </>
    );
}

export default EditVenue;
