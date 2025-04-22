import { APILogin, APIRegister } from "./Constants";

export const headerKey = "78ddf18d-7d41-498d-939d-195c2b76f939";

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

export async function register(userName, email, password, userType) {
    const registerResponse = await fetch(APIRegister, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, email, password, userType }),
    });

    if (registerResponse.ok) {
        alert("Registration successful! Please login to continue.");
    } else {
        const err = await registerResponse.json();
        console.error(err);
        throw err;
    }
}

export function logout() {
    localStorage.clear();
    window.location.href = "/";
}
