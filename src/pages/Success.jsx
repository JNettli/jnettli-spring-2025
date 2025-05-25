import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

function Success() {
    const { state } = useLocation();
    const profileId = localStorage.getItem("userName");
    const navigate = useNavigate();

    useEffect(() => {
        if (!profileId) {
            toast.info("You need to be logged in to view this page!");
            navigate("/");
        }
    });

    if (!state) {
        document.title = "Something went wrong here..";
    } else {
        document.title = `You've booked ${state.venue}! | Holidaze`;
    }

    if (!state) {
        return (
            <div className="flex flex-col items-center justify-center text-center pt-16">
                <h1 className="text-2xl font-semibold">
                    No booking data found.
                </h1>
                <Link
                    to={"/"}
                    className="underline pt-4"
                    aria-label="Go back to home page"
                >
                    Back to Home
                </Link>
            </div>
        );
    }
    return (
        <>
            <div className="flex justify-center">
                <div className="md:max-w-5xl w-full md:mt-20 mt-8">
                    <div className="flex flex-col md:justify-around md:border md:border-slate-900/20 md:p-16 md:shadow-md rounded-xl mx-8">
                        <div className="text-center self-center">
                            <img
                                src="/img/positive.svg"
                                alt="Checkmark"
                                className="mx-auto mb-4 -mt-8"
                            />
                            <p className="text-xl">Booking Confirmed!</p>
                            <p className="mb-8">
                                Thank you for booking{" "}
                                <strong>{state.venue}</strong>.
                            </p>
                            <Link
                                to={"/"}
                                className="flex justify-center mb-8 text-lg font-semibold bg-[#088D9A] border-[#088D9A] border transition duration-150 text-white rounded-full p-4 hover:bg-white hover:text-black"
                                aria-label="Go back to home page"
                            >
                                Back to home page!
                            </Link>
                        </div>
                        <div className="border border-slate-900/50 mt-4 text-gray-700 md:min-w-lg min-w-full max-w-2xl mx-auto rounded-xl">
                            <span className="relative -top-3 left-2 bg-white px-1 w-fit font-bold">
                                Booking Summary
                            </span>
                            <div className="py-2 px-4 -mt-4">
                                <p className="flex justify-between">
                                    <strong>Date From: </strong>
                                    {new Date(
                                        state.dateFrom
                                    ).toLocaleDateString()}
                                </p>
                                <p className="flex justify-between">
                                    <strong>Date To: </strong>
                                    {new Date(
                                        state.dateTo
                                    ).toLocaleDateString()}
                                </p>
                                <p className="flex justify-between">
                                    <strong>Total Nights:</strong>{" "}
                                    {(new Date(state.dateTo) -
                                        new Date(state.dateFrom)) /
                                        (1000 * 60 * 60 * 24) +
                                        1}
                                </p>
                                <p className="flex justify-between">
                                    <strong>Venue Price per Night:</strong>
                                    {state.price}
                                </p>
                                <p className="flex justify-between">
                                    <strong>Guests:</strong>
                                    {state.guests}
                                </p>
                                <div className="border-b border-slate-900/50"></div>
                                <p className="flex justify-between">
                                    <strong>Total Price: </strong>
                                    <strong>
                                        $
                                        {((new Date(state.dateTo) -
                                            new Date(state.dateFrom)) /
                                            (1000 * 60 * 60 * 24) +
                                            1) *
                                            state.price}
                                    </strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Success;
