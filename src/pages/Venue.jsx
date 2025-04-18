import { Link } from "react-router-dom";

function Venue() {
    return (
        <>
            <div className="flex justify-center">
                <div className="bg-white max-w-7xl min-w-5xl">
                    <p className="text-lg">All Venues!</p>
                    <Link to={"/checkout"}>Checkout!</Link>
                </div>
            </div>
        </>
    );
}

export default Venue;
