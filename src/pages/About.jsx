import { Link } from "react-router-dom";

function About() {
    return (
        <>
            <div className="flex justify-center">
                <div className="bg-white max-w-7xl min-w-5xl">
                    <p className="text-lg">About Us</p>
                    <Link to={"/checkout"}>Checkout!</Link>
                </div>
            </div>
        </>
    );
}

export default About;
