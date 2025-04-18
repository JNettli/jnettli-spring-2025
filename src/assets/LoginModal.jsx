import { useState, useEffect } from "react";

export default function LoginModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [fade, setFade] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [passwordScore, setPasswordScore] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setFade(true), 10);
        } else {
            setFade(false);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                closeModal();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const closeModal = () => {
        setFade(false);
        setTimeout(() => setIsOpen(false), 200);
    };

    const getPasswordScore = (password) => {
        let score = 0;
        if (password.length >= 6) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/\d/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        return score;
    };

    useEffect(() => {
        const score = getPasswordScore(password);
        setPasswordScore(score);
    }, [password]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-[#007A8D] text-white px-4 py-2 rounded-md hover:bg-[#006473] transition hover:cursor-pointer"
            >
                Login
            </button>

            {isOpen && (
                <div
                    onClick={closeModal}
                    className={`fixed inset-0 flex items-center justify-center z-50 transition duration-150 ${
                        fade ? "bg-black/50" : "bg-transparent"
                    }`}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className={`bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm transform transition-all duration-300 relative ${
                            fade
                                ? "scale-100 opacity-100"
                                : "scale-95 opacity-0"
                        }`}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-3xl font-bold hover:cursor-pointer"
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
                                        placeholder="Username"
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
                                    placeholder="E-mail"
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
                                    placeholder="Password"
                                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007A8D]"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (error && e.target.value.trim())
                                            setError("");
                                    }}
                                />
                                {isRegister && (
                                    <>
                                        <p className="mt-2 text-sm font-medium text-gray-700">
                                            Password Strength:
                                        </p>
                                        <div className="mt-2 h-2 w-full bg-gray-200 rounded-lg overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 ${
                                                    passwordScore === 0
                                                        ? "w-0"
                                                        : passwordScore === 1
                                                        ? "w-1/4 bg-red-500"
                                                        : passwordScore === 2
                                                        ? "w-2/4 bg-yellow-500"
                                                        : passwordScore === 3
                                                        ? "w-3/4 bg-yellow-400"
                                                        : "w-full bg-green-500"
                                                }`}
                                            ></div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {!isRegister && (
                                <div className="flex items-center justify-between">
                                    <label className="inline-flex items-center hover:cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-4 w-4 text-[#007A8D] border-gray-300 rounded hover:cursor-pointer"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            Remember me
                                        </span>
                                    </label>

                                    <button
                                        type="button"
                                        className="text-sm text-[#007A8D] hover:underline hover:cursor-pointer"
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
                                className="w-full bg-[#007A8D] text-white py-2 rounded-md hover:bg-[#006473] transition hover:cursor-pointer"
                            >
                                {isRegister ? "Register" : "Sign In"}
                            </button>
                        </form>

                        <div className="text-center text-sm mt-4 text-gray-600">
                            {isRegister ? (
                                <>
                                    Already have an account?{" "}
                                    <button
                                        className="text-[#007A8D] hover:underline hover:cursor-pointer"
                                        onClick={() => setIsRegister(false)}
                                    >
                                        Login
                                    </button>
                                </>
                            ) : (
                                <>
                                    Don’t have an account?{" "}
                                    <button
                                        className="text-[#007A8D] hover:underline hover:cursor-pointer"
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
