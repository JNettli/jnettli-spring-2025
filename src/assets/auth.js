import { APILogin, APIRegister } from "./Constants";
import { toast } from "react-toastify";

export const APIKEY = import.meta.env.VITE_API_KEY;

export async function login(email, password) {
    const loginResponse = await fetch(`${APILogin}/?_holidaze=true`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        localStorage.setItem("token", loginData.data.accessToken);
        localStorage.setItem("userId", loginData.data.email);
        localStorage.setItem("userName", loginData.data.name);
        localStorage.setItem("userImage", loginData.data.avatar.url);
        localStorage.setItem(
            "venueManager",
            loginData.data.venueManager.toString()
        );
    } else {
        const err = await loginResponse.json();
        console.error(err);
        throw err;
    }
}

export async function register(name, email, password, userType) {
    const registerResponse = await fetch(APIRegister, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, userType }),
    });
    if (registerResponse.ok) {
        toast.success("Registration successful! Please login to continue.");
    } else {
        const err = await registerResponse.json();
        console.error(err);
        throw err;
    }
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userImage");
    localStorage.removeItem("venueManager");
    setTimeout(() => {
        window.location.reload();
    }, 500);
}
