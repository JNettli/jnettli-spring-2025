import { useState, useEffect } from "react";

export default function LoginModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [fade, setFade] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setFade(true), 10);
        } else {
            setFade(false);
        }
    }, [isOpen]);

    const closeModal = () => {
        setFade(false);
        setTimeout(() => setIsOpen(false), 200);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-[#007A8D] text-white px-4 py-2 rounded-md hover:bg-[#006473] transition"
            >
                Login
            </button>

            {isOpen && (
                <div
                    className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
                        fade ? "bg-black/50" : "bg-transparent"
                    }`}
                >
                    <div
                        className={`bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm transform transition-all duration-300 relative ${
                            fade
                                ? "scale-100 opacity-100"
                                : "scale-95 opacity-0"
                        }`}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                        >
                            &times;
                        </button>

                        <h2 className="text-2xl font-semibold text-center mb-4 text-[#007A8D]">
                            {isRegister
                                ? "Create Account"
                                : "Login to Holidaze"}
                        </h2>

                        <form className="space-y-4">
                            {isRegister && (
                                <div>
                                    <label
                                        htmlFor="username"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        required
                                        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007A8D]"
                                    />
                                </div>
                            )}

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007A8D]"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    required
                                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007A8D]"
                                />
                            </div>

                            {!isRegister && (
                                <div className="flex items-center justify-between">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-4 w-4 text-[#007A8D] border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            Remember me
                                        </span>
                                    </label>

                                    <button
                                        type="button"
                                        className="text-sm text-[#007A8D] hover:underline"
                                        onClick={() =>
                                            alert("Forgot password flow TBD")
                                        }
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-[#007A8D] text-white py-2 rounded-md hover:bg-[#006473] transition"
                            >
                                {isRegister ? "Register" : "Sign In"}
                            </button>
                        </form>

                        <div className="text-center text-sm mt-4 text-gray-600">
                            {isRegister ? (
                                <>
                                    Already have an account?{" "}
                                    <button
                                        className="text-[#007A8D] hover:underline"
                                        onClick={() => setIsRegister(false)}
                                    >
                                        Login
                                    </button>
                                </>
                            ) : (
                                <>
                                    Don’t have an account?{" "}
                                    <button
                                        className="text-[#007A8D] hover:underline"
                                        onClick={() => setIsRegister(true)}
                                    >
                                        Register
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
