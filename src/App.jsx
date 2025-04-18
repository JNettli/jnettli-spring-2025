import { Link } from "react-router-dom";
import { APIVenues } from "./assets/Constants";

function App() {
    async function getVenues() {
        const res = await fetch(APIVenues + "?_owner=true&_bookings=true");
        const data = await res.json();
        console.log(data.data);
    }

    getVenues();
    return (
        <>
            <div className="flex justify-center">
                <div className="bg-white max-w-7xl min-w-5xl">
                    <p className="text-lg">Home Page</p>
                    <Link to={"/checkout"}>Checkout!</Link>
                </div>
            </div>
        </>
    );
}

export default App;
