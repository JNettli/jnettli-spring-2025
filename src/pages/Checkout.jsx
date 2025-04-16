import { Link } from "react-router-dom";

function Checkout() {
    return (
        <>
            <div className="bg-blue-600 min-w-screen">
                <p className="text-lg text-white">
                    You are at the venue list page now!
                    <Link to={"/checkout/success"}>Complete checkout!</Link>
                </p>
            </div>
        </>
    );
}

export default Checkout;
