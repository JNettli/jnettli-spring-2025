import { Link } from "react-router-dom";

function App() {
    return (
        <>
            <div className="flex justify-center">
                <div className="bg-white max-w-7xl min-w-5xl">
                    <p className="text-lg">Home Page</p>
                    <Link to={"/venues"}>All Venues</Link>
                </div>
            </div>
        </>
    );
}

export default App;
