import { APILogin, APIRegister } from "./Constants";

export const APIKEY = import.meta.env.VITE_API_KEY;

export async function login(email, password) {
    const loginResponse = await fetch(APILogin, {
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
    console.log(JSON.stringify({ name, email, password, userType }));
    if (registerResponse.ok) {
        alert("Registration successful! Please login to continue.");
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
    window.location.href = "/";
}
